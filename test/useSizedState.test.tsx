import { renderHook, act } from "@testing-library/react-hooks";
import useSizedState from "../src/useSizedState";

const items = [
  { id: "item0" },
  { id: "item1" },
  { id: "item2" },
  { id: "item3" },
  { id: "item4" },
];

describe("test useSizedState", () => {
  test("should add three items", () => {
    const { result } = renderHook(() =>
			useSizedState({
				min: 1,
				max: 3
			})
    );
		act(() => {
			result.current.add(items[0])
			result.current.add(items[1])
			result.current.add(items[2])
		})
    expect(result.current.list).toMatchObject([items[0], items[1], items[2]]);
  });
  test("should not add when reach max", () => {
    const { result } = renderHook(() =>
			useSizedState({
				min: 1,
				max: 3
			})
    );
		act(() => {
			result.current.add(items[0])
			result.current.add(items[1])
			result.current.add(items[2])
		})
		act(() => {
			result.current.add(items[3])
		})
		expect(result.current.list).toMatchObject([items[0], items[1], items[2]]);
	});
	test("should remove item", () => {
		const { result } = renderHook(() =>
			useSizedState<{id: string}, "id">({
				min: 1,
				max: 3
			})
		);
		act(() => {
			result.current.add(items[0])
			result.current.add(items[1])
			result.current.add(items[2])
		})
		act(() => {
			result.current.remove(p => p.id !== "item2")
		})
		expect(result.current.list).toMatchObject([items[0], items[1]]);
	});
	test("should not remove item when reach min", () => { 
		const { result } = renderHook(() => 
			useSizedState<{id: string}, "id">({
				min: 2,
				max: 3
			})
		);
		act(() => { result.current.add(items[0]) })
		act(() => { result.current.add(items[1]) })
		act(() => { result.current.add(items[2]) })
		act(() => { result.current.add(items[3]) })
		expect(result.current.list).toMatchObject([items[0], items[1], items[2]]);
		act(() => {
			result.current.remove(p => p.id !== "item1")
		})
		act(() => {
			result.current.remove(p => p.id !== "item2")
		})
		expect(result.current.list).toMatchObject([items[0], items[2]]);
	});
	test("should replace by new object regarding to id", () => {
		const { result } = renderHook(() => 
			useSizedState<{id: string}, "id">({
				min: 2,
				max: 3 ,
				indexKey: "id"
			})
		);
		act(() => {
			result.current.add(items[0])
			result.current.add(items[1])
			result.current.add(items[2])
		})
		expect(result.current.list).toMatchObject([items[0], items[1], items[2]]);
		act(() => {
			result.current.replaceByIndexKey("item1", items[4])
		})
		expect(result.current.list).toMatchObject([items[0], items[4], items[2]]);
	})
});
