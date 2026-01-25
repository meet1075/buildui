import React from 'react'
import { MessageRole, MessageType } from '@/generated/prisma/enums'
import type { Fragment } from '@/generated/prisma/client'
import { ChevronRightIcon, Code2Icon, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { format } from "date-fns";
interface Props {
  content: string
  role: MessageRole
  fragment: Fragment | null
  createdAt: Date
  isActiveFragment: boolean
  onFragmentClick: () => void
  type: MessageType
}

interface FragmentCardProps {
  fragment: Fragment
  isActiveFragment: boolean
  onFragmentClick: (fragment: Fragment) => void
}

const FragmentCard = ({ fragment, isActiveFragment, onFragmentClick }: FragmentCardProps) => {
  return (
    <button
      className={cn(
        "flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-2 hover:bg-secondary transition-colors",
        isActiveFragment &&
          "bg-primary text-primary-foreground border-primary hover:bg-primary"
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <Code2Icon className="size-4 mt-0.5" />
      <div className="flex flex-col flex-1">
        <span className="text-sm font-medium line-clamp-1">
          {fragment.title}
        </span>
        <span className="text-sm">Preview</span>
      </div>
      <div className="flex items-center justify-center mt-0.5">
        <span className="text-sm">
          <ChevronRightIcon className="size-4" />
        </span>
      </div>
    </button>
  );
};

const UserMessage = ({ content }: { content: string }) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10">
      <Card
        className={
          "rounded-lg bg-muted p-2 shadow-none border-none max-w-[80%] break-words"
        }
      >
        {content}
      </Card>
    </div>
  );
};

interface AssistantMessageProps {
  content: string
  fragment: Fragment | null
  createdAt: Date
  isActiveFragment: boolean
  onFragmentClick: () => void
  type: MessageType
}

const AssistantMessage = ({
    content ,
    fragment,
    createdAt,
    isActiveFragment,
    onFragmentClick,
    type
}: AssistantMessageProps)=>{
    return(
        <div className={cn("flex flex-col group px-2 pb-4",
            type===MessageType.ERROR && "text-red-700 dark:text-red-500"
        )}>
            <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
        
          alt="BuildUi"
          src={"/logo.svg"}
          height={30}
          width={30}
          className="invert dark:invert-0"
        />
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {format(new Date(createdAt), "HH:mm 'on' MMM dd, yyyy")}
        </span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
       <span>{content}</span>
       {fragment && type===MessageType.RESULT && (
            <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          /> 
        )
       }
      </div>
        </div>
    )
}
const MessageCard = ({
    content,
    role,
    fragment,   
    createdAt,
    isActiveFragment,
    onFragmentClick,
    type
}: Props) => {
    if (role === MessageRole.ASSISTANT) {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
      />
    );
  }
  return(
    <div className='mt-5'>
        <UserMessage content={content}/>
    </div>
  )
  return (
    <div>
      
    </div>
  )
}

export default MessageCard
