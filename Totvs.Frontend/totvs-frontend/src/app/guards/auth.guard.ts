import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  return true;
};

// export const loginGuard = () => {
//   const supabaseService = inject(SupabaseService);
//   const router = inject(Router);

//   if (!supabaseService.currentUserValue) {
//     return true;
//   }

//   router.navigate(['/trading']);
//   return false;
// };
