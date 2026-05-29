type SubjectIconProps = {
  subjectId: string;
  className?: string;
};

export default function SubjectIcon({ subjectId, className = "size-[24px]" }: SubjectIconProps) {
  if (subjectId === 'math') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24">
        <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.11 21 21 20.1 21 19V5C21 3.9 20.11 3 19 3ZM13.5 18H11.5V16H9.5V14H11.5V12H13.5V14H15.5V16H13.5V18ZM18 9H6V7H18V9Z" fill="white" />
      </svg>
    );
  }

  if (subjectId === 'german') {
    return (
      <div className={className}>
        <div className="h-full w-full relative overflow-clip">
          <div className="absolute inset-0">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 19.636">
              <path d="M0 13.09H24V19.636H0V13.09Z" fill="#FFCB00" />
              <path d="M0 6.545H24V13.091H0V6.545Z" fill="#E32D3C" />
              <path d="M0 0H24V6.546H0V0Z" fill="black" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (subjectId === 'biology') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 18.4394">
        <path d="M12 0L0 6.14646V8.21975L12 14.3662L24 8.21975V6.14646L12 0ZM12 2.43939L19.7455 6.14646L12 9.92725L4.25455 6.14646L12 2.43939ZM2.18182 10.2929L12 15.439L21.8182 10.2929V12.3662L12 17.5122L2.18182 12.3662V10.2929Z" fill="white" />
      </svg>
    );
  }

  if (subjectId === 'history') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.95 15.95L11 12.66V6H13V11.34L17.95 13.95L16.95 15.95Z" fill="white" />
      </svg>
    );
  }

  if (subjectId === 'english') {
    return (
      <div className={className}>
        <div className="h-full w-full relative overflow-clip">
          <div className="absolute inset-0">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 16">
              <path d="M0 0H24V16H0V0Z" fill="#012169" />
              <path d="M0 0L24 16M24 0L0 16" stroke="white" strokeWidth="3.2" />
              <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" strokeWidth="2" />
              <path d="M12 0V16M0 8H24" stroke="white" strokeWidth="5.333" />
              <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="3.2" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (subjectId === 'chemistry') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 23">
        <path d="M14.4 0V7.66667L20.4 18.8333C21.12 20.0583 20.28 21.6667 18.84 21.6667H5.16C3.72 21.6667 2.88 20.0583 3.6 18.8333L9.6 7.66667V0H14.4ZM12 3.61667H11.28V8.66667L8.4 13.4167H15.6L12.72 8.66667V3.61667H12Z" fill="white" />
      </svg>
    );
  }

  if (subjectId === 'french') {
    return (
      <div className={className}>
        <div className="h-full w-full relative overflow-clip">
          <div className="absolute inset-0">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 16">
              <path d="M16 0H24V16H16V0Z" fill="#E32D3C" />
              <path d="M8 0H16V16H8V0Z" fill="white" />
              <path d="M0 0H8V16H0V0Z" fill="#2B4896" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
