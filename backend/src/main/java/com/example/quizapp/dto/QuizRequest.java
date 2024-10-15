package com.example.quizapp.dto;

import com.example.quizapp.enums.Severity;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizRequest {

	@NotBlank(message = "Title is required.")
	@Size(min = 3, max = 100, message = "Title should have between 3 and 100 characters.")
	private String title;

	@NotBlank(message = "Description is required.")
	@Size(min = 10, max = 255, message = "Description should have between 10 and 255 characters.")
	private String description;

	private String quizPic;

	@NotNull(message = "Time limit should not be null.")
	@Min(value = 1, message = "Time limit should be greater than 0.")
	private Long timeLimit;

	@NotNull(message = "Passing percentage should not be null.")
	@Min(value = 10, message = "Passing percentage should be greater than 9.")
	@Max(value = 100, message = "Passing percentage should be less or equal to 100.")
	private Long pass;

	private Boolean randomizeQuestions;

	private Long categoryId;

	@NotNull(message = "Severity should not be null.")
	private Severity severity;
}
