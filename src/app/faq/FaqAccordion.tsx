'use client';

import { useState } from 'react';
import styles from './faq.module.css';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is Red Dragon Social Club?",
    answer: "Red Dragon Social Club (RDSC) is a community centered around mahjong and Asian diaspora culture in the Netherlands. We host regular mahjong sessions, social events, and community gatherings across the Netherlands for everyone from total beginners to seasoned players."
  },
  {
    question: "Who can join?",
    answer: "Everyone is welcome! You don't need to be of Asian descent, and you don't need to know how to play. If you're curious about mahjong or just looking for a fun, welcoming community, you belong here."
  },
  {
    question: "What's included in the ticket?",
    answer: "Your ticket covers entry to the session, access to mahjong tables and sets, and guidance from our hosts. Some events may include additional perks like drinks or snacks. Check the specific event listing for details."
  },
  {
    question: "Can I come alone?",
    answer: "Absolutely, and lots of people do! Our events are specifically designed to be easy to walk into solo. You'll be seated with other players and introduced to the group. It's one of the best ways to meet people."
  },
  {
    question: "I'm a beginner. Will there be an instructor?",
    answer: "Yes! We always have hosts on hand to guide new players that have a beginner ticket. If you're a beginner, we recommend arriving on time, as introductory instruction starts at the beginning of the session. If you arrive late, you may miss part of the walkthrough, though we'll always do our best to catch you up."
  },
  {
    question: "Do I have to arrive on time?",
    answer: "For free play sessions, you're welcome to drop in whenever works for you. However, if you're signed up for the beginner sessions, we strongly recommend arriving at the start. The introductory instructions begin at the opening of the session and won't be repeated in full. Latecomers may miss some of the basics."
  },
  {
    question: "What style of mahjong will be played?",
    answer: "We teach Hong Kong style mahjong, but you're absolutely free to play your own style or learn a new one! Past sessions have seen tables playing Riichi, Surinamese, Sichuan, Singaporean, and Taiwanese. I really depends on who shows up. We love the variety, but we can't guarantee which styles will be at any given session."
  },
  {
    question: "Can I bring my own mahjong set?",
    answer: "You're welcome to bring your own set, though it's not necessary. We provide sets at all our events. If you do bring one, please check in with the host so we can find you a table."
  },
  {
    question: "What is the cancellation policy?",
    answer: "Tickets are refundable up to 4 days before the event, so we have enough time to open your spot to someone on the waitlist. After that, tickets are non-refundable. If something comes up last minute, feel free to reach out via email or DM. We'll always do our best to help where we can."
  },
  {
    question: "Can I transfer my ticket to someone else?",
    answer: "Yes, ticket transfers are allowed. Just make sure the person attending has your booking confirmation and name, and give us a heads up beforehand."
  },
  {
    question: "How do I stay updated on upcoming events?",
    answer: "Follow us on Instagram and keep an eye on our website for the latest sessions, locations, and announcements. We also have a WhatsApp community where members get early updates and event reminders. Send us a DM on Instagram to get access."
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.accordion}>
      {faqs.map((faq, index) => (
        <div key={index} className={styles.item}>
          <button
            className={styles.questionBtn}
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
          >
            {faq.question}
          </button>
          <div
            className={styles.answerWrapper}
            style={{ maxHeight: openIndex === index ? '500px' : '0' }}
          >
            <div className={styles.answerContent}>
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
