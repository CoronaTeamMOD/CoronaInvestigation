import Authority from 'models/Authority';

export const SET_AUTHORITIES = 'SET_AUTHORITIES';

interface setAuthorities {
    type: typeof SET_AUTHORITIES;
    payload: { authorities: Map<string, Authority> };
}

export type authorityAction = setAuthorities;
