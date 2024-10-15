package com.example.quizapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.quizapp.dto.AuthResponse;
import com.example.quizapp.dto.LoginRequest;
import com.example.quizapp.dto.SignupRequest;
import com.example.quizapp.dto.UnifiedResponse;
import com.example.quizapp.entity.User;
import com.example.quizapp.exception.ApprovalPendingException;
import com.example.quizapp.exception.ResourceAlreadyExistsException;
import com.example.quizapp.exception.ResourceNotFoundException;
import com.example.quizapp.repository.UserRepository;
import com.example.quizapp.util.CommonHelper;
import com.example.quizapp.util.JwtHelper;

@Service
public class AuthService {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtHelper jwtHelper;

	@Autowired
	private MyUserDetailService userDetailsService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CommonHelper commonHelper;

	public UnifiedResponse<User> register(SignupRequest registerUser) {
		if (userRepository.existsByEmail(registerUser.getEmail())) {
			throw new ResourceAlreadyExistsException(
					"User already exists with this email . Please try with other credentials.");
		}

		User user = new User();
		user.setName(registerUser.getName());
		user.setEmail(registerUser.getEmail());
		user.setPassword(passwordEncoder.encode(registerUser.getPassword()));
		user.setRole(registerUser.getRole());
		user.setProfilePic(registerUser.getProfilePic());
		user.setBio(registerUser.getBio());
		user.setIsDeleted(false);
		user.setEducation(registerUser.getEducation());
		return commonHelper.returnUnifiedCREATED("Registered successfully", userRepository.save(user));
	}

	public UnifiedResponse<AuthResponse> login(LoginRequest authRequest) {
		findUserByEmail(authRequest.getEmail());

		if (!passwordEncoder.matches(authRequest.getPassword(), findUserByEmail(authRequest.getEmail()).getPassword()))
			throw new ResourceNotFoundException("Invalid credentials please enter the valid email and password");

		if (findUserByEmail(authRequest.getEmail()).getIsDeleted() != null
				&& findUserByEmail(authRequest.getEmail()).getIsDeleted() == true)
			throw new ResourceNotFoundException("You have been blocked by the admin");

		if (findUserByEmail(authRequest.getEmail()).getRole().name().equals("Educator")
				&& (!userRepository.isApprovedByEmail(authRequest.getEmail())) && passwordEncoder
						.matches(authRequest.getPassword(), findUserByEmail(authRequest.getEmail()).getPassword()))
			throw new ApprovalPendingException("Approval is pending from the admin side please wait");

		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
		UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
		String token = jwtHelper.generateToken(userDetails);

		User user = findUserByEmail(authRequest.getEmail());

		return commonHelper.returnUnifiedOK("Logged in successfully",
				new AuthResponse(token, user.getRole().name(), user.getIsApproved()));
	}

	public User findUserByEmail(String email) {
		return userRepository.findByEmail(email).orElseThrow(
				() -> new UsernameNotFoundException("Invalid credentials please enter the valid email and password"));
	}
}
