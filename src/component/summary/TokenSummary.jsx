import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tokenSummaryActions } from "../../redux/reducers/keys/TokenSummary";
import { TokenSummarySelector } from "../../redux/selector/keys/TokenSummarySelector";

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TokenIcon from '@mui/icons-material/Token';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const AnimatedNumber = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTimestamp = null;
        const duration = 1000;
        const startValue = displayValue;
        const endValue = Number(value) || 0;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentCount = Math.floor(progress * (endValue - startValue) + startValue);
            
            setDisplayValue(currentCount);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [value]);

    return <>{displayValue.toLocaleString()}</>;
};

export const TokenSummary = () => {
    const dispatch = useDispatch();
    const tokenSummaryData = useSelector(TokenSummarySelector);

    const formatDate = (date) => date.toISOString().split('T')[0];
    const now = new Date();
    const todayStr = formatDate(now);
    
    const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayPrevMonth = new Date();

    const [dates, setDates] = useState({
        from: formatDate(firstDayPrevMonth),
        to: formatDate(lastDayPrevMonth)
    });

    const [error, setError] = useState("");

    useEffect(() => {
        handleApply();
    }, []);

    const handleApply = () => {
        setError(""); 
        const { from, to } = dates;

        if (!from) {
            setError("Please select a 'From' date.");
            return;
        }

        if (to && new Date(from) > new Date(to)) {
            setError("'From' date cannot be later than the 'To' date.");
            return;
        }

        if (new Date(from) > now || (to && new Date(to) > now)) {
            setError("Dates cannot be in the future.");
            return;
        }

        const formattedFrom = from.replaceAll("-", "/");
        const formattedTo = (to || from).replaceAll("-", "/");

        dispatch(tokenSummaryActions.getAll({ 
            from: formattedFrom, 
            to: formattedTo 
        }));
    };

    return (
        <div>
            <div className="bg-white rounded-md shadow p-4 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Sales Summary</h2>
                        <p className="text-slate-500 text-sm mt-1">Manage and monitor your token performance</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <div className={`flex items-center gap-2 px-3 py-1 bg-white rounded border shadow-sm transition-colors ${!dates.from && error ? 'border-red-500' : 'border-slate-200'}`}>
                                <CalendarMonthIcon className="text-slate-400 !text-sm" />
                                <input 
                                    type="date"
                                    max={dates.to || todayStr} 
                                    className="bg-transparent text-sm text-slate-700 focus:outline-none "
                                    value={dates.from}
                                    onChange={(e) => {
                                        setError("");
                                        setDates({ ...dates, from: e.target.value });
                                    }}
                                />
                            </div>

                            <span className="text-slate-400 font-bold hidden sm:inline">→</span>

                            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded border border-slate-200 shadow-sm">
                                <CalendarMonthIcon className="text-slate-400 !text-sm" />
                                <input 
                                    type="date"
                                    min={dates.from}
                                    max={todayStr} 
                                    className="bg-transparent text-sm text-slate-700 focus:outline-none"
                                    value={dates.to}
                                    onChange={(e) => {
                                        setError("");
                                        setDates({ ...dates, to: e.target.value });
                                    }}
                                />
                            </div>

                            <button 
                                onClick={handleApply}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-sm outline-none focus:outline-none"
                            >
                                Apply Range
                            </button>
                        </div>

                        {error && (
                            <div className="flex items-center gap-1 text-red-500 text-xs font-medium animate-pulse">
                                <ErrorOutlineIcon style={{ fontSize: '14px' }} />
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded shadow border-l-4 border-blue-500 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-semibold uppercase text-xs tracking-wider mb-1">Tokens Issued</p>
                        <h4 className="text-3xl font-black text-slate-900">
                            <AnimatedNumber value={tokenSummaryData?.data?.totalTokens} />
                        </h4>
                    </div>
                    <div className="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center">
                        <TokenIcon className="text-blue-600 !text-3xl" />
                    </div>
                </div>

                <div className="bg-white p-8 rounded shadow border-l-4 border-emerald-500 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-semibold uppercase text-xs tracking-wider mb-1">Total Revenue</p>
                        <h4 className="text-3xl font-black text-slate-900">
                            ₹<AnimatedNumber value={tokenSummaryData?.data?.totalPrice} />
                        </h4>
                    </div>
                    <div className="h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center">
                        <AccountBalanceWalletIcon className="text-emerald-600 !text-3xl" />
                    </div>
                </div>
            </div>

            {!tokenSummaryData?.data?.status && !error && tokenSummaryData?.data?.totalTokens === 0 && (
                <div className="mt-12 text-center p-10 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">Select a date range and click Apply to see your summary.</p>
                </div>
            )}
        </div>
    );
};