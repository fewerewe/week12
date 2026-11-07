'use client'

import { Badge } from "@/components/tailgrids/core/badge";
export default function Header () {
    return (
        // header container
        <div className='mt-4 text-center'>
            {/* code */}
            <div className='flex justify-center gap-4'>
        <Badge className='text-3xl rounded-lg py-1 px-3 bg-red-600 text-white -rotate-6'>C</Badge>
        <Badge className='text-3xl rounded-lg py-1 px-3 bg-green-700 text-white rotate-3'>S</Badge>
        <Badge className='text-3xl rounded-lg py-1 px-3 bg-blue-600 text-white -rotate-3'>I</Badge>
        <Badge className='text-3xl rounded-lg py-1 px-3 bg-sky-500 text-white rotate-2'>2</Badge>
        <Badge className='text-3xl rounded-lg py-1 px-3 bg-orange-500 text-white -rotate-2'>0</Badge>
        <Badge className='text-3xl rounded-lg py-1 px-3 bg-slate-700 text-white rotate-3'>5</Badge>
            </div>

            {/* name */}

            <div className='mt-4'>
                <Badge size="lg">FRONT END SOFTWARE DEVELOPMENT</Badge>
            </div>

        </div>
    )
}