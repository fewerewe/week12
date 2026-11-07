'use client'

import Link from "next/link";

import { Badge } from "@/components/tailgrids/core/badge";
import { Facebook, Twitter } from "@tailgrids/icons";

export default function Footer() {
    return (
        // Footer container
        <div className='mt-4 text-center'>
            {/* student */}
            <div>
                <Badge className='text-xl text-black rounded-lg'>68084477 นายชลันธร ชูแก้ว</Badge>
            </div>
            {/* contacts */}

            <div className='mt-4 flex justify-center gap-4'>
                <Link href={'https://www.facebook.com/Mé Féw'} target='_blank'>
                <Facebook className='text-blue-600'/>
                </Link>
                    

                    <div className='border-l-1'></div>
                     <Link href={'https://www.twitter.com/Mé Féw'} target='_blank'>
                    <Twitter />
                </Link>
            </div>
        </div>
    )
}