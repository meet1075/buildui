import ProjectForm from '@/modules/home/components/project-form'
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div className='flex items-center justify-center w-full px-4 py-8'>
    
      <div className='max-w-5xl w-full'>
        <section className='space-y-8 flex flex-col items-center'>
          <div className='flex flex-col items-center'>
          <Image
            src={"/logo.svg"}
            width={100}
            height={100}
            alt='Logo'
            className='hidden md:block invert dark:invert-0'
          />
          </div>
          <h1 className='text-2xl md:text-5xl font-bold text-center'>Build Something with BuildUi ❤️‍🔥</h1>
          <p className='text-lg md:text-xl text-muted-foreground text-center'>Create Websites with the help of Ai</p>
          <div className='w-full max-w-3xl'>
            <ProjectForm/>
          </div>
        </section>
      </div>
    </div>
  )
}

export default page
