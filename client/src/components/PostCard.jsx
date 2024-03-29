import React from 'react'
import { Link } from 'react-router-dom'
import { Card,Button } from "flowbite-react";
function PostCard({post}) {
  return (
    <div className="md:min-w-[384px] mt-2">
          <Card className="max-w-sm mt-2"  >
            <Link to={`/post/${post.slug}`}>
                <img src={post.image} alt={post.title} className='w-full object-cover h-52 hover:border-2 transition-shadow duration-500 '/>
            </Link>
              <p className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white w-full line-clamp-2">
                  {post.title}
              </p>
              <Link to={`/post/${post.slug}`}>
                <Button className='w-full'>
                    Read more
                </Button>
              </Link>
          </Card>
    </div>
  )
}

export default PostCard
