'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search, Filter, Edit2, Trash2, CheckCircle, XCircle, UserPlus, Loader2, Crown, ShieldCheck, Mail, Briefcase, Calendar, ChevronDown, GraduationCap, Layers, ShieldAlert, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminMembers() {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const existingTeams = [
    'Core Team',
    'Project Team',
    'Web Team',
    'Blockchain Team',
    'PR/Content Team',
    'Design Team'
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'TeamMember',
    team: 'Core Team',
  });

  useEffect(() => {
    if (formData.role === 'PI') {
      setFormData(prev => ({ ...prev, team: 'Institutional Head / Faculty' }));
    } else if (formData.team === 'Institutional Head / Faculty') {
      setFormData(prev => ({ ...prev, team: 'Core Team' }));
    }
  }, [formData.role]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('/api/admin/members');
        const data = await res.json();
        if (data.success) {
          setMembers(data.members);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name?.toLowerCase().includes(search.toLowerCase()) ||
        member.email?.toLowerCase().includes(search.toLowerCase()) ||
        member.team?.toLowerCase().includes(search.toLowerCase());

      const matchesRole = selectedRole === 'All' || member.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [members, search, selectedRole]);

  const stats = useMemo(() => {
    return {
      totalTeams: existingTeams.length,
      bearersCount: members.filter(m => m.role === 'OfficeBearer').length,
      alumniCount: members.filter(m => m.role === 'Alumni').length,
    };
  }, [members]);

  const paginatedMembers = useMemo(() => {
    if (search !== '') return filteredMembers;
    return filteredMembers.slice(0, visibleCount);
  }, [filteredMembers, visibleCount, search]);

  const handleCreateMember = async () => {
    try {
      const res = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to onboard credential node');
        return;
      }

      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'TeamMember', team: 'Core Team' });

      const membersRes = await fetch('/api/admin/members');
      const membersData = await membersRes.json();
      if (membersData.success) {
        setMembers(membersData.members);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8 min-h-screen text-slate-200">
      
      {/* Header View */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">System Administration</h1>
          <p className="text-xs text-slate-400 mt-1">Configure workspace credentials, ranks, and divisional matrix pipelines.</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg border border-blue-500/20"
        >
          <UserPlus className="w-4 h-4" />
          Onboard Member
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { title: 'Active Division Teams', count: stats.totalTeams, icon: Layers, color: 'border-cyan-500/10 text-cyan-400' },
          { title: 'Core Office Bearers', count: stats.bearersCount, icon: ShieldCheck, color: 'border-blue-500/10 text-blue-400' },
          { title: 'Alumni Network Track', count: stats.alumniCount, icon: GraduationCap, color: 'border-emerald-500/10 text-emerald-400' }
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white/[0.01] border ${card.color.split(' ')[0]} p-5 rounded-xl flex items-center justify-between shadow-sm`}
          >
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{card.title}</span>
              <h3 className="text-3xl font-black text-white mt-1">{loading ? '...' : card.count}</h3>
            </div>
            <div className={`p-2.5 rounded-lg bg-white/5 ${card.color.split(' ')[1]}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Control Utility Row */}
      <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="relative w-full md:w-80 group">
          <input
            type="text"
            placeholder="Search index database registers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/40 border border-white/5 rounded-lg py-2.5 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-blue-500/40 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400" />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 border border-white/5 px-3 py-2 rounded-lg w-full md:w-auto justify-between">
          <span className="font-bold uppercase tracking-wider text-slate-500">Filter Privilege:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs ml-2"
          >
            <option value="All" className="bg-slate-950">All Active Ranks</option>
            <option value="PI" className="bg-slate-950">PI (Faculty Head)</option>
            <option value="President" className="bg-slate-950">President</option>
            <option value="OfficeBearer" className="bg-slate-950">Office Bearer</option>
            <option value="TeamLeader" className="bg-slate-950">Team Leader</option>
            <option value="TeamMember" className="bg-slate-950">Team Member</option>
            <option value="Alumni" className="bg-slate-950">Alumni</option>
          </select>
        </div>
      </div>

      {/* Fixed Layout Column Header (Hidden on Mobile) */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-9 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        <div className="col-span-4">Identity Details</div>
        <div className="col-span-2">Access Node</div>
        <div className="col-span-2">Division</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2 text-right pr-6">Timeline & Control</div>
      </div>

      {/* Grid Aligned Member Row Cards */}
      <div className="space-y-3">
        {loading && (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-2 bg-white/[0.01] border border-white/5 rounded-xl">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-xs text-slate-400">Pulling ecosystem profile directories...</span>
          </div>
        )}

        {!loading && paginatedMembers.length === 0 && (
          <div className="p-12 text-center text-xs text-slate-500 bg-white/[0.01] border border-white/5 rounded-xl">
            No tracked profiles match the specified filters or parameters.
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {!loading && paginatedMembers.map((member) => {
            let borderStyle = "border-white/5 bg-white/[0.01]";
            let glowIndicator = "bg-transparent";
            let iconBoxStyle = "bg-blue-500/10 text-blue-400";
            let RankIcon = Award;

            if (member.role === 'PI') {
              borderStyle = "border-purple-500/20 bg-purple-500/[0.02]";
              glowIndicator = "bg-purple-500";
              iconBoxStyle = "bg-purple-500/20 text-purple-400";
              RankIcon = ShieldAlert;
            } else if (member.role === 'President') {
              borderStyle = "border-amber-500/20 bg-amber-500/[0.02]";
              glowIndicator = "bg-amber-500";
              iconBoxStyle = "bg-amber-500/20 text-amber-400";
              RankIcon = Crown;
            } else if (member.role === 'OfficeBearer') {
              borderStyle = "border-blue-500/20 bg-blue-500/[0.02]";
              glowIndicator = "bg-blue-500";
              iconBoxStyle = "bg-blue-500/20 text-blue-400";
              RankIcon = ShieldCheck;
            } else if (member.role === 'TeamLeader') {
              borderStyle = "border-emerald-500/20 bg-emerald-500/[0.02]";
              glowIndicator = "bg-emerald-500";
              iconBoxStyle = "bg-emerald-500/20 text-emerald-400";
            }

            return (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={member._id}
                className={`border p-4 rounded-xl grid grid-cols-1 lg:grid-cols-12 gap-4 items-start lg:items-center transition-all duration-200 relative overflow-hidden px-5 lg:px-8 ${borderStyle}`}
              >
                {/* Visual glow strip */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${glowIndicator}`} />

                {/* Col 1: Identity Frame (Name / Email) */}
                <div className="col-span-1 lg:col-span-4 flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-sm shadow-inner ${iconBoxStyle}`}>
                    {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0 truncate">
                    <h4 className="font-bold text-sm text-white flex items-center gap-1.5 truncate">
                      {member.name}
                      {(member.role === 'PI' || member.role === 'President' || member.role === 'OfficeBearer') && (
                        <RankIcon className="w-3.5 h-3.5 flex-shrink-0" />
                      )}
                    </h4>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <Mail className="w-3 h-3 text-slate-600 flex-shrink-0" />
                      {member.email}
                    </span>
                  </div>
                </div>

                {/* Col 2: Access Node (Role) */}
                <div className="col-span-1 lg:col-span-2 flex flex-col lg:block">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider lg:hidden mb-0.5">Access Node</span>
                  <span className="text-xs font-bold text-slate-200">{member.role}</span>
                </div>

                {/* Col 3: Division (Team) */}
                <div className="col-span-1 lg:col-span-2 flex flex-col lg:block">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider lg:hidden mb-0.5">Division</span>
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    {member.team || 'Core Team'}
                  </span>
                </div>

                {/* Col 4: Status */}
                <div className="col-span-1 lg:col-span-2 flex flex-col lg:block">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider lg:hidden mb-0.5">Status</span>
                  <span className={`text-xs font-bold flex items-center gap-1 ${member.status === 'inactive' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {member.status === 'inactive' ? <XCircle className="w-3 h-3 flex-shrink-0" /> : <CheckCircle className="w-3 h-3 flex-shrink-0" />}
                    {member.status || 'active'}
                  </span>
                </div>

                {/* Col 5: Control Panel (Timestamp & Action Buttons) */}
                <div className="col-span-1 lg:col-span-2 flex lg:flex-row items-center justify-between lg:justify-end gap-4 w-full border-t lg:border-t-0 border-white/5 pt-3 lg:pt-0">
                  <div className="flex flex-col lg:items-end">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider lg:hidden">Timestamp</span>
                    <span className="text-xs text-slate-400">{member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-md transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Dynamic Limit Control Button */}
        {search === '' && filteredMembers.length > visibleCount && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setVisibleCount(prev => prev + 8)}
              className="flex items-center gap-1.5 px-5 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-slate-300 transition-all border border-white/10"
            >
              Show More Rows
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Creation Modal System */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white">Configure Workspace Access</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>

              {/* Form container with explicit disabled settings to kill browser predictive filling patterns */}
              <form onSubmit={(e) => e.preventDefault()} autoComplete="off" className="space-y-4">
                {/* Fake dummy traps to trick browser auto-fill engines */}
                <input type="text" className="hidden" aria-hidden="true" autoComplete="false" />
                <input type="password" className="hidden" aria-hidden="true" autoComplete="false" />

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Identity Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    autoComplete="new-unique-name"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    autoComplete="new-unique-email"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Security Key Token</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    autoComplete="new-password"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Privilege Rank</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="PI" className="bg-zinc-950">PI (Faculty / Professor)</option>
                      <option value="President" className="bg-zinc-950">President</option>
                      <option value="OfficeBearer" className="bg-zinc-950">Office Bearer</option>
                      <option value="TeamLeader" className="bg-zinc-950">Team Leader</option>
                      <option value="TeamMember" className="bg-zinc-950">Team Member</option>
                      <option value="Alumni" className="bg-zinc-950">Alumni</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Functional Segment</label>
                    <select
                      value={formData.team}
                      disabled={formData.role === 'PI'}
                      onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                      className={`w-full p-2.5 rounded-lg bg-white/5 border text-xs focus:outline-none cursor-pointer transition-all ${
                        formData.role === 'PI' 
                          ? 'border-purple-500/30 text-purple-400 font-medium bg-purple-950/20 cursor-not-allowed' 
                          : 'border-white/10 text-white focus:border-blue-500'
                      }`}
                    >
                      {formData.role === 'PI' ? (
                        <option value="Institutional Head / Faculty" className="bg-zinc-950">Faculty Authority</option>
                      ) : (
                        existingTeams.map(t => (
                          <option key={t} value={t} className="bg-zinc-950">{t}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={handleCreateMember}
                  className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs shadow-md transition-all border border-blue-400/20"
                >
                  Generate Credentials
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}