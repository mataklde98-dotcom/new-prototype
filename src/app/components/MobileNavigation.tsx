import React from 'react';
import svgPaths from '@/imports/Tabbar/svg-zzlu2krfds';
import imgFrame2147229225 from '@/imports/Tabbar/11f2cba78544b625c5eb2fd44f01e7f071e6d476.png';

interface MobileNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isVisible?: boolean;
}

type TabId = 'Home' | 'KI-Tools' | 'Meetings' | 'Chats' | 'Profil';

function ProfileFrame() {
  return (
    <div className="pointer-events-none relative rounded-[100px] shrink-0 size-[44px]">
      <div className="absolute inset-0 overflow-hidden rounded-[100px]">
        <img
          alt=""
          className="absolute h-[179%] left-[-10.02%] max-w-none top-[-9.12%] w-[119.33%]"
          src={imgFrame2147229225}
        />
      </div>
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
    </div>
  );
}

interface ItemProps {
  id: TabId;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  isProfile?: boolean;
}

function Item({ id, active, onClick, children, isProfile }: ItemProps) {
  const bg = active ? 'bg-[rgba(161,173,152,0.5)]' : 'bg-[rgba(255,255,255,0.04)]';
  const padding = isProfile ? 'p-[10px]' : '';
  return (
    <button
      type="button"
      aria-label={id}
      onClick={onClick}
      className={`${bg} ${padding} content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[48px] active:scale-95 transition-[background,transform] duration-150`}
      data-name="tabbar item"
      style={{ WebkitTapHighlightColor: 'transparent', border: 'none', cursor: 'pointer' }}
    >
      {children}
    </button>
  );
}

export default React.memo(function MobileNavigation({
  activeTab = 'Home',
  onTabChange,
  isVisible = true,
}: MobileNavigationProps) {
  const handle = (id: TabId) => () => onTabChange?.(id);

  // Active fill is dark; inactive fill is grey — matches Figma export
  const activeFill = '#18181B';
  const inactiveFill = '#71717A';
  const fillFor = (id: TabId) => (activeTab === id ? activeFill : inactiveFill);

  return (
    <div
      className="bg-[rgba(161,173,152,0.1)] content-stretch flex gap-[4px] items-center p-[4px] relative rounded-[9999px] size-full"
      data-name="tabbar"
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        transform: isVisible ? 'translateY(0)' : 'translateY(calc(100% + 20px))',
        transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        willChange: 'transform',
      }}
    >
      <Item id="Home" active={activeTab === 'Home'} onClick={handle('Home')}>
        <div className="relative shrink-0 size-[20px]" data-name="home-dash">
          <div className="absolute inset-[9.38%_9.37%_9.38%_9.38%]" data-name="home-dash">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.2512 16.2483">
              <path d={svgPaths.p2576dd00} fill={fillFor('Home')} id="home-dash" />
            </svg>
          </div>
        </div>
      </Item>

      <Item id="KI-Tools" active={activeTab === 'KI-Tools'} onClick={handle('KI-Tools')}>
        <div className="relative shrink-0 size-[20px]" data-name="books">
          <div className="absolute inset-[12.49%_8.35%_12.49%_8.33%]" data-name="books">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6633 15.0027">
              <path d={svgPaths.p9cf1280} fill={fillFor('KI-Tools')} id="books" />
            </svg>
          </div>
        </div>
      </Item>

      <Item id="Meetings" active={activeTab === 'Meetings'} onClick={handle('Meetings')}>
        <div className="relative shrink-0 size-[20px]" data-name="graduation-cap">
          <div className="absolute inset-[13.53%_9.38%]" data-name="graduation-cap">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.25 14.5875">
              <path d={svgPaths.p1384ed80} fill={fillFor('Meetings')} id="graduation-cap" />
            </svg>
          </div>
        </div>
      </Item>

      <Item id="Chats" active={activeTab === 'Chats'} onClick={handle('Chats')}>
        <div className="relative shrink-0 size-[20px]" data-name="chart-bar-alt">
          <div className="absolute inset-[9.38%]" data-name="chart-bar-alt">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.25 16.25">
              <path d={svgPaths.p32ad5680} fill={fillFor('Chats')} id="chart-bar-alt" />
            </svg>
          </div>
        </div>
      </Item>

      <Item id="Profil" active={activeTab === 'Profil'} onClick={handle('Profil')} isProfile>
        <ProfileFrame />
      </Item>
    </div>
  );
});
