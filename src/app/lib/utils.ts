export const shuffleArray = <T>(array: T[]): T[] => {
    const shuffledArray = [...array]; // Create a copy of the original array
    
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements randomly
    }
  
    return shuffledArray;
  };

  export function checkUserRole(session: any) {
    if (
      !session ||
      !session.user ||
      !session.user.organizationMemberships ||
      session.user.organizationMemberships.length === 0
    ) {
      return null; // Return null if the user is not a basic member
    }
  
    const organizationMemberships = session.user.organizationMemberships;
  
    // Loop through all organization memberships
    for (const membership of organizationMemberships) {
      if (membership.role) {
        return membership.role.toLowerCase(); // Return the role in lowercase if it exists
      }
    }
  
    return null; // Return null if no role is found in the memberships
  }
