'use client';

import { useEffect, useState } from 'react';
import { AdvisorsTab } from '@/components/advisor-board/AdvisorsTab';
import { PrepilotTab } from '@/components/advisor-board/PrepilotTab';

type Tab = 'advisors' | 'prepilot';

const TAB_STORAGE_KEY = 'education-for-equality-advisor-board-active-tab';

export default function AdvisorBoardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('advisors');

  useEffect(() => {
    const saved = window.localStorage.getItem(TAB_STORAGE_KEY);
    if (saved === 'advisors' || saved === 'prepilot') setActiveTab(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(TAB_STORAGE_KEY, activeTab);
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-[#f7fbf9]">
      <div className="border-b border-emerald-100 bg-white">
        <div className="mx-auto flex max-w-7xl gap-1 px-4 sm:px-6 lg:px-8">
          {(
            [
              { id: 'advisors', label: 'Advisors' },
              { id: 'prepilot', label: 'Pre-pilot' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-[var(--primary-dark)] text-[var(--primary-dark)]'
                  : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'advisors' ? <AdvisorsTab /> : <PrepilotTab />}
    </main>
  );
}
