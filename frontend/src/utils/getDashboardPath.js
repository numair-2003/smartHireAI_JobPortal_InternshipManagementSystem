export const getDashboardPath = (role) => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'recruiter':
      return '/recruiter';
    case 'student':
    default:
      return '/student';
  }
};
