"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

interface Member {
  id: string;
  surname: string;
  givenName: string;
}

const DEFAULT_GROUPS: string[] = [];

export default function SundayGroupsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [groups, setGroups] = useState<Record<string, string[]>>({});

  const [activeTab, setActiveTab] = useState<'groups' | 'list'>('groups');
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedListGroup, setSelectedListGroup] = useState<string>('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }
  }, [status, router]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members?status=ACTIVE');
      if (!res.ok) throw new Error('Failed to load members');
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load members');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = () => {
    const name = newGroupName.trim();
    if (!name) return toast.error('Enter a group name');
    if (groups[name]) return toast.error('Group already exists');
    setGroups(prev => ({ ...prev, [name]: [] }));
    setNewGroupName('');
    toast.success(`Group "${name}" created`);
  };

  const deleteGroup = (name: string) => {
    if (!confirm(`Delete group "${name}"?`)) return;
    setGroups(prev => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
    toast.success(`Group "${name}" deleted`);
  };

  const addMemberToGroup = (group: string, memberId: string) => {
    if (!memberId) return toast.error('Select a member');
    setGroups(prev => {
      const copy = { ...prev };
      const already = copy[group]?.includes(memberId);
      if (!already) copy[group] = [...(copy[group] || []), memberId];
      return copy;
    });
    setSelectedMemberId('');
    toast.success('Member added');
  };

  const removeMemberFromGroup = (group: string, memberId: string) => {
    setGroups(prev => ({ ...prev, [group]: prev[group].filter(id => id !== memberId) }));
    toast.success('Member removed');
  };

  const groupList = Object.keys(groups);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4169E1] to-[#000080] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4169E1] to-[#000080] pb-24">
      {/* Header with back button and logo */}
      <div className="bg-gradient-to-r from-[#4169E1] via-[#3A60D0] to-[#000080] px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="relative w-16 h-16">
            <Image
              src="/images/MAS LOGO.png"
              alt="MAS Logo"
              fill
              sizes="64px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* White content card */}
      <div className="bg-white rounded-t-[2rem] mt-4 min-h-screen px-6 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">SUNDAY GROUPS</h2>
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-5 py-2 rounded-full font-semibold transition-all ${
              activeTab === 'groups'
                ? 'bg-blue-900 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Groups
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-5 py-2 rounded-full font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-blue-900 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Group List
          </button>
        </div>

        {activeTab === 'groups' ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Groups</h3>

            <div className="space-y-3 mb-6">
              <input
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                placeholder="Group Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <button onClick={createGroup} className="w-full px-5 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800">
                Create
              </button>
            </div>

            {/* Groups list table */}
            <div>
              <div className="grid grid-cols-2 gap-4 mb-4 border-b pb-2">
                <div className="font-semibold text-gray-900">Group Name</div>
                <div className="font-semibold text-gray-900">Members Count</div>
              </div>
              {groupList.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No groups created yet</p>
              ) : (
                <div className="space-y-2">
                  {groupList.map((name) => (
                    <div key={name} className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg items-center">
                      <div className="text-gray-900 font-medium">{name}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{(groups[name] || []).length}</span>
                        <button
                          onClick={() => deleteGroup(name)}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">Group List</h2>

              <div className="mb-4 space-y-3">
                <select
                  value={selectedListGroup}
                  onChange={e => setSelectedListGroup(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                >
                  <option value="">Select group...</option>
                  {groupList.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>

                <select
                  value={selectedMemberId}
                  onChange={e => setSelectedMemberId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                >
                  <option value="">Select member to add...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.surname}, {m.givenName}</option>
                  ))}
                </select>

                <button onClick={() => addMemberToGroup(selectedListGroup, selectedMemberId)} className="w-full px-5 py-3 bg-green-600 text-white rounded-xl font-semibold">Add</button>
              </div>

              <div className="space-y-3">
                {(groups[selectedListGroup] || []).length === 0 ? (
                  <p className="text-sm text-gray-500">No members in this group.</p>
                ) : (
                  (groups[selectedListGroup] || []).map(id => {
                    const m = members.find(x => x.id === id);
                    return (
                      <div key={id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                        <div className="font-medium text-gray-900">{m ? `${m.surname}, ${m.givenName}` : 'Unknown member'}</div>
                        <button onClick={() => removeMemberFromGroup(selectedListGroup, id)} className="text-red-500 font-medium">Remove</button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        <div className="mt-6 text-right">
          <button onClick={() => toast.success('Saved locally')} className="px-5 py-3 bg-blue-900 text-white rounded-2xl shadow hover:bg-blue-800">Save</button>
        </div>
      </div>
    </div>
  );
}
