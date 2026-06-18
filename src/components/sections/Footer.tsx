'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'
export function Footer() {
  return (
    <>
    <footer className="
    mt-20 
    border-t 
    border-border
    ">

      <div className="
      flex 
      flex-col px-10 
      relative 
      z-3 
      md:grid 
      md:grid-cols-2 
      xl:flex 
      xl:flex-row 
      justify-between 
      gap-10 
      py-16 
      border-b 
      border-border
      ">

        <div>
          <h2 className="
          text-5xl 
          font-bold 
          tracking-wider 
          mb-8
          ">
            TES<span className="text-primary">LA</span>
          </h2>

          <p className="
          text-muted-foreground 
          max-w-xs 
          leading-8
          ">
            Tesla is the most active technical club of NIT Patna.
            <br/>
            NIT Patna's premier EE Club.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="
          text-muted-foreground 
          text-xl 
          tracking-wider 
          mb-2 
          font-bold
          ">
            NAVIGATE
          </h4>

          {[
            'Teams',
            'Events',
            'Blogs',
            'Resources',
            'Alumni',
            'Gallery',
            'Contact'
          ].map((item) => (
            <a key={item} href="#" className="
            text-gray-400 
            hover:text-primary 
            hover:translate-x-1 
            transition-all
            ">
              {item}
            </a>

          ))}
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="
          text-muted-foreground 
          text-xl 
          tracking-wider 
          mb-2 
          font-bold
          ">
            CONTACT
          </h4>

          <p className="text-gray-400">tesla@nitp.ac.in</p>
          <p className="text-gray-400">NIT Patna, Ashok Rajpath, Bihta,<br/> Patna, Bihar 800005, India</p>
          <p className="text-gray-400">+91 9008745678</p>
        </div>

        <div className="
        flex 
        flex-col 
        gap-3 
        min-w-[220px]
        ">
          <h4 className="
          text-muted-foreground 
          text-xl 
          tracking-wider 
          font-bold
          ">
            SOCIAL
          </h4>

          <a href="#" className="
          hover:text-primary 
          transition-all
          ">
          <FontAwesomeIcon icon={faInstagram} />
             Instagram
          </a>

          <a href="#" className="
          hover:text-primary 
          transition-all
          ">
          <FontAwesomeIcon icon={faFacebookF} />
            Facebook
          </a>

          <a href="#" className="hover:text-primary transition-all">
          <FontAwesomeIcon icon={faGithub} />
            GitHub
          </a>

          <a href="#" className="hover:text-primary transition-all">
          <FontAwesomeIcon icon={faLinkedinIn} />
            Linkedin
          </a>

          <a href="#" className="hover:text-primary transition-all">
            <FontAwesomeIcon icon={faXTwitter} />
            Twitter
          </a>
          
          <a href="#" className="hover:text-primary transition-all">
            <FontAwesomeIcon icon={faYoutube} />
            Youtube
          </a>
          
          <a href="#" className="hover:text-primary transition-all">
            <FontAwesomeIcon icon={faEnvelope} />
            Email
          </a>

        </div>

      </div>

      

      <div className="
      relative 
      py-1 
      px-10 
      overflow-hidden
      ">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
          className="
          text-[3rem] 
          md:text-[5rem] 
          xl:text-[7rem] 
          font-black 
          text-[#0f0f0f] 
          select-none
          ">
          TESLA NITP
        </motion.div>
      </div>

      <div className="text-center text-muted-foreground ">
        © 2026 TESLA · NIT Patna · All Rights Reserved
      </div>

    </footer>
    </>
  );
}