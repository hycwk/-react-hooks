import { useCallback, useMemo, useState } from 'react';

interface PromiseResult {
	resolve: (v: boolean) => void;
	reject: (v: boolean) => void;
}

export default function useSizedState<T, K extends keyof T>({min, max, indexKey}: {min: number; max: number, indexKey?: K}) {

	const [list, setList] = useState<Array<T>>([]);
	
	const add = (item: T) => new Promise((resolve: PromiseResult['resolve'], reject: PromiseResult['reject']) => {
		if (list.length < max) {
			setList(prev => {
				return [...prev, item]
			})
			resolve(true);
		}
		resolve(false);
	})

	const remove =(filterFn:  (prevItem: T) => boolean) => new Promise((resolve: PromiseResult['resolve'], reject: PromiseResult['reject']) => {
		if (list.length > min) {
			if (filterFn) {
				setList(prev => {
					return prev.filter(filterFn)
				})
			}
			resolve(false);
		}
		resolve(true);
	})

	const replaceByIndexKey = (indexVal: T[K], newObj: T) => {
		if (typeof indexKey === 'undefined') {
			return false;
		}
		setList(prev => {
			const newState = [...prev];
			const index = newState.findIndex(item => item[indexKey] === indexVal);
			newState[index] = newObj;
			return newState;
		})
	}

	return { add, remove, replaceByIndexKey, list }
}