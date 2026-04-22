import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { LayoutDashboard, PieChart as PieIcon, BarChart3, TrendingUp, Users, FolderKanban } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL || ''}`;

const COLORS = ['#10b981', '#06b6d4', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

interface StatRow {
    department: string;
    year: string;
    count: number;
}

const Dashboard: React.FC = () => {
    const [data, setData] = useState<StatRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [deptChartType, setDeptChartType] = useState<'bar' | 'pie'>('bar');
    const [yearChartType, setYearChartType] = useState<'bar' | 'pie'>('pie');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_URL}/projects/stats`);
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    // Process data for charts
    const deptData = Object.values(data.reduce((acc: any, curr) => {
        if (!acc[curr.department]) acc[curr.department] = { name: curr.department, value: 0 };
        acc[curr.department].value += curr.count;
        return acc;
    }, {}));

    const yearData = Object.values(data.reduce((acc: any, curr) => {
        const yearLabel = curr.year || 'Unknown';
        if (!acc[yearLabel]) acc[yearLabel] = { name: yearLabel, value: 0 };
        acc[yearLabel].value += curr.count;
        return acc;
    }, {}));

    const totalProjects = data.reduce((sum, curr) => sum + curr.count, 0);
    const totalDepts = deptData.length;

    const renderDepartmentChart = () => {
        if (deptChartType === 'bar') {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            interval={0}
                            height={80}
                            stroke="#94a3b8"
                            fontSize={12}
                            fontFamily="inherit"
                            fontWeight={600}
                        />
                        <YAxis stroke="#94a3b8" fontSize={12} fontWeight={600} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar dataKey="value" name="Projects" radius={[6, 6, 0, 0]}>
                            {deptData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            );
        }
        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={deptData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={8}
                        dataKey="value"
                    >
                        {deptData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-gray-600 font-bold ml-1">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        );
    };

    const renderYearChart = () => {
        if (yearChartType === 'bar') {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            fontSize={12}
                            fontFamily="inherit"
                            fontWeight={600}
                        />
                        <YAxis stroke="#94a3b8" fontSize={12} fontWeight={600} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar dataKey="value" name="Projects" radius={[6, 6, 0, 0]}>
                            {yearData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            );
        }
        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={yearData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={8}
                        dataKey="value"
                    >
                        {yearData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-gray-600 font-bold ml-1">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl shadow-lg shadow-emerald-200">
                        <LayoutDashboard className="text-white h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Project Analytics</h1>
                        <p className="text-gray-500 font-medium">Real-time insights into student contributions</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                            <FolderKanban className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Projects</p>
                            <p className="text-3xl font-bold text-gray-800">{totalProjects}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-cyan-50 rounded-xl text-cyan-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Departments</p>
                            <p className="text-3xl font-bold text-gray-800">{totalDepts}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Latest Year</p>
                            <p className="text-3xl font-bold text-gray-800">2026</p>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Department Distribution */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="text-emerald-500 h-6 w-6" />
                                <h2 className="text-xl font-bold text-gray-800">Projects per Department</h2>
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-center">
                                <button
                                    onClick={() => setDeptChartType('bar')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${deptChartType === 'bar' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Bar
                                </button>
                                <button
                                    onClick={() => setDeptChartType('pie')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${deptChartType === 'pie' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Pie
                                </button>
                            </div>
                        </div>
                        <div className="h-[400px]">
                            {renderDepartmentChart()}
                        </div>
                    </div>

                    {/* Yearly Distribution */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div className="flex items-center gap-2">
                                <PieIcon className="text-cyan-500 h-6 w-6" />
                                <h2 className="text-xl font-bold text-gray-800">Yearly Distribution</h2>
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-center">
                                <button
                                    onClick={() => setYearChartType('bar')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${yearChartType === 'bar' ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Bar
                                </button>
                                <button
                                    onClick={() => setYearChartType('pie')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${yearChartType === 'pie' ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Pie
                                </button>
                            </div>
                        </div>
                        <div className="h-[400px]">
                            {renderYearChart()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
