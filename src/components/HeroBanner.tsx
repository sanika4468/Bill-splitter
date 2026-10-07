import React from 'react';
import { ThemeConfig } from '../types';
import { Sparkles, Users, Heart, Clock } from 'lucide-react';

interface Props {
  theme: ThemeConfig;
  memberCount: number;
}

const HERO_IMG = '/src/assets/images/friendship_dinner_feast_1791392933254.jpg';
const MASCOT_IMG = '/src/assets/images/dining_friends_mascot_1791392978512.jpg';

export const HeroBanner: React.FC<Props> = ({ theme, memberCount }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-black/5 group">
      {/* Background Image with Measured Contrast Scrim */}
      <div className="relative h-44 sm:h-52 md:h-60 w-full overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Friends sharing dinner feast at restaurant table"
          className="w-full h-full object-cover object-center transform group-hover:scale-103 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Ambient Dark Gradient Scrim ensuring 100% text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/20" />

        {/* Content Overlaid onto Hero */}
        <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl overflow-hidden border-2 border-white/80 shadow-md bg-white shrink-0">
              <img
                src={MASCOT_IMG}
                alt="Dining Friends Mascot"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  Dining &amp; Bill Settle
                </span>
                <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
                  No awkward math · Settle in 10s
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-sm">
                Friendship Dinner Splitter
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-300 font-medium pt-1">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{memberCount} friends at the table</span>
            </span>
            <span className="hidden xs:flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>India ₹ + Global Currencies</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Fair &amp; stress-free</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
