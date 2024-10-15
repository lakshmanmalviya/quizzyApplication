import FAQs from '@/components/common/Home/FAQS';
import HappyNumbers from '@/components/common/Home/HappyNumbers';
import SocialMedia from '@/components/common/Home/SocialMedia';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchUsersRequest } from '@/redux/slices/usersSlice';
import { RootState } from '@/redux/store';
import { Filters, Role } from '@/types/types';
import { useEffect, useRef, useState } from 'react';
import About from './About';
import MeetEducators from './Carousel';
import { Footer } from './Footer';
import GetInTouch from './GetInTouch';
import GetStarted from './GetStarted';
import Navbar from './Navbar';

export const DefaultHome = () => {
  const { users } = useAppSelector((state: RootState) => state.user);
  const latestQuizzesRef = useRef<HTMLDivElement>(null);
  const mentorsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const params = new URLSearchParams();
  const [filters] = useState<Filters>({ role: Role.EDUCATOR });

  useEffect(() => {
    prepareParams();
    dispatch(fetchUsersRequest("public" + params.toString()));
  }, []);

  const prepareParams = () => {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, value.toString());
      }
    });
  }

  return (
    <>
      <div
        style=
        {{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%'
        }}>
        <Navbar
          latestQuizzesRef={latestQuizzesRef}
          mentorsRef={mentorsRef}
          aboutRef={aboutRef}
          contactRef={contactRef}
        />
        <GetStarted />
        <div ref={latestQuizzesRef} >
        </div>
        <div ref={mentorsRef}>
          <MeetEducators
            educators={users.content}
          />
        </div>
        <div ref={aboutRef}>
          <About />
        </div>
        <HappyNumbers />
        <FAQs />
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', width: '100%' }}
          ref={contactRef}
        >
          <SocialMedia />
          <GetInTouch />
        </div>
        <Footer />
      </div >
    </>
  )
}