const paths = {
  briefcase: (
    <>
      <path d="M10 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
      <path d="M4 8h20v13H4z" />
      <path d="M4 13h20" />
      <path d="M12 13v2h4v-2" />
    </>
  ),
  search: (
    <>
      <path d="m21 21-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </>
  ),
  spark: (
    <>
      <path d="M13 3 5 14h7l-1 7 8-12h-7l1-6z" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
      <path d="M16 3.2a4 4 0 0 1 0 7.6" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V5" />
      <path d="M4 20h20" />
      <path d="M8 16v-5" />
      <path d="M13 16V8" />
      <path d="M18 16v-3" />
    </>
  ),
  bell: (
    <>
      <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h20l-2-2z" />
      <path d="M10 21a2.5 2.5 0 0 0 4 0" />
    </>
  ),
  check: (
    <>
      <path d="m5 13 4 4L19 7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  location: (
    <>
      <path d="M12 22s7-5.6 7-12a7 7 0 1 0-14 0c0 6.4 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 5 3.5 8.5 7 10 3.5-1.5 7-5 7-10V6l-7-3z" />
      <path d="m9 12 2 2 4-5" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 20h14" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h20" />
      <path d="M4 12h20" />
      <path d="M4 17h20" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </>
  ),
  building: (
    <>
      <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      <path d="M4 21h20" />
      <path d="M9 7h2" />
      <path d="M14 7h2" />
      <path d="M9 11h2" />
      <path d="M14 11h2" />
      <path d="M10 21v-5h4v5" />
    </>
  ),
};

const Icon = ({ name, className = 'h-5 w-5', strokeWidth = 1.9 }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
    viewBox="0 0 24 24"
  >
    {paths[name] || paths.spark}
  </svg>
);

export default Icon;
