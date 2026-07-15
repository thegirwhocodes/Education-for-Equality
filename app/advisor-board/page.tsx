'use client';

import { useEffect, useState } from 'react';
import { AdvisorsTab } from '@/components/advisor-board/AdvisorsTab';
import { DocsTab } from '@/components/advisor-board/DocsTab';
import { PrepilotTab } from '@/components/advisor-board/PrepilotTab';
import { TasksTab } from '@/components/advisor-board/TasksTab';
import { TeamTab } from '@/components/advisor-board/TeamTab';

type Tab = 'tasks' | 'docs' | 'team' | 'advisors' | 'prepilot';

const TAB_STORAGE_KEY = 'education-for-equality-advisor-board-active-tab';
const VALID_TABS: readonly Tab[] = ['tasks', 'docs', 'team', 'advisors', 'prepilot'] as const;

export default function AdvisorBoardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');

  useEffect(() => {
    const saved = window.localStorage.getItem(TAB_STORAGE_KEY) as Tab | null;
    if (saved && VALID_TABS.includes(saved)) setActiveTab(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(TAB_STORAGE_KEY, activeTab);
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-[#f7fbf9]">
      <div className="border-b border-emerald-100 bg-white">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {(
            [
              { id: 'tasks', label: 'Tasks' },
              { id: 'docs', label: 'Docs' },
              { id: 'team', label: 'Team' },
              { id: 'advisors', label: 'Advisors' },
              { id: 'prepilot', label: 'Pre-pilot' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-5 py-3 text-sm font-semibold transition ${
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

      {activeTab === 'tasks' ? <TasksTab /> : null}
      {activeTab === 'docs' ? <DocsTab /> : null}
      {activeTab === 'team' ? <TeamTab /> : null}
      {activeTab === 'advisors' ? <AdvisorsTab /> : null}
      {activeTab === 'prepilot' ? <PrepilotTab /> : null}
    </main>
  );
}
