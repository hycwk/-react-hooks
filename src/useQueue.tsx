import React, { useEffect, useState } from 'react';

export interface OptionalItemId {
	id?: string;
}

export interface QueueId {
	queueId: string;
}

export type QueueItem<T> = T & QueueId;

/**
 * 
 * @returns add function
 * @returns remove function
 * @returns queue Array
 * @returns head item of queue
 */
export function useQueue<T extends OptionalItemId>() {

	const [queue, setQueue] = useState<QueueItem<T>[] | []>([]);
	const [head, setHead] = useState<QueueItem<T> | undefined>(undefined);

	useEffect(() => {
		if (typeof queue[0] !== 'undefined') {
			const headItem = queue[0];
			setHead(headItem);
		} else {
			setHead(undefined)
		}
	}, [queue])

	/**
	 * 
	 * @param item
	 * @returns Queue id string
	 */
	const add = (item: T): string => {
		// TODO improve id generator
		const queueId = typeof item.id === 'string' ? item.id : `${Date.now().toString().substring(0, 6)}`;
		const queueItem: QueueItem<T> = {
			queueId,
			...item
		}
		const hasID = (e: QueueItem<T>) => e.queueId === item.id;
		if (queue.some(hasID) === false) {
			setQueue(prevState => {
				return prevState.some(hasID) ? [...prevState] : [...prevState, queueItem]
			});
		}
		return queueId;
	}

	/**
	 * 
	 * @param queueId string
	 */
	const removeById = (queueId: string) => {
		setQueue(prevState => prevState.filter(item => item.queueId !== queueId));
	}

	return {add, removeById, queue, head}

}
