import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

// 이 컴포넌트는 user가 로그인 했는지 여부에 따라, projects 페이지로 보내거나, sign-in 페이지로 보낼 수 있어야 한다. 
// 브라우저가 요청을 보낼 때 쿠키를 함께 전송, 서버(Next.js)가 그 쿠키를 파싱하고 Clerk 서버에 검증 요청, 검증 결과가 올 때까지 기다려야(wait) 함
async function HomePage() {
  const {userId} = await auth(); 

  if (userId){
    redirect("/projects");
  } else {
    redirect("/sign-in");
  } 
}

export default HomePage

