import React, {useState} from "react";
import style from "./App.module.css";

interface Item {
	id: number;
	title: string;
}

interface Board {
	id: number;
	title: string;
	items: Item[];
}

export const App = (): JSX.Element => {
	const [boards, setBoards] = useState<Board[]>([
		{
			id: 1,
			title: "Дом",
			items: [
				{id: 1, title: "Пойти в магазин"},
				{id: 2, title: "Выкинуть Мусор"},
				{id: 3, title: "Покормить кота"},
			],
		},
		{
			id: 2,
			title: "Работа",
			items: [
				{id: 4, title: "Пагинация"},
				{id: 5, title: "Таблица"},
				{id: 6, title: "Совещание"},
			],
		},
		{
			id: 3,
			title: "Английский",
			items: [
				{id: 7, title: "Cat"},
				{id: 8, title: "dog"},
				{id: 9, title: "cow"},
			],
		},
	]);

	const setBoxShadowToNone = ({currentTarget}: React.DragEvent<HTMLDivElement>): void => {
		currentTarget.style.boxShadow = "none";
	};

	const dragOverHandler = ({preventDefault, currentTarget}: React.DragEvent<HTMLDivElement>): void => {
		preventDefault();

		if (currentTarget.className === style.item) {
			currentTarget.style.boxShadow = "0 4px 3px gray";
		}
	};

	const [currentBoard, setCurrentBoard] = useState<Board>(null);
	const [currentItem, setCurrentItem] = useState<Item>(null);

	const dragLeaveHandler = (event: React.DragEvent<HTMLDivElement>): void => {
		setBoxShadowToNone(event);
	};

	const dragStartHandler = (board: Board, item: Item): void => {
		setCurrentBoard(board);
		setCurrentItem(item);
	};

	const dragEndHandler = (event: React.DragEvent<HTMLDivElement>): void => {
		setBoxShadowToNone(event);
	};

	const dropHandler = (event: React.DragEvent<HTMLDivElement>, endBoard: Board, item: Item): void => {
		event.preventDefault();

		if (endBoard.id === 3 && currentBoard.id !== 3) {
			alert(`Нельзя  в ${endBoard.title} переносить с другой колонки`);
			setBoxShadowToNone(event);
			return;
		}

		setBoxShadowToNone(event);

		const currentIndex = currentBoard.items.indexOf(currentItem);
		currentBoard.items.splice(currentIndex, 1);

		const dropIndex = endBoard.items.indexOf(item);
		endBoard.items.splice(dropIndex + 1, 0, currentItem);

		setBoards(
			boards.map(board => {
				const {id} = board;

				if (id === endBoard.id) {
					return board;
				}

				if (id === currentBoard.id) {
					return currentBoard;
				}

				return board;
			}),
		);
	};

	return (
		<div className={style.app}>
			{boards.map(board => {
				const {id, items, title} = board;

				return (
					<div className={style.board} key={id}>
						<div className={style.board_title}> {title}</div>
						{items.map(item => {
							const {id: itemId, title: itemTitle} = item;

							return (
								<div
									key={itemId}
									onDragOver={event => dragOverHandler(event)}
									onDragLeave={event => dragLeaveHandler(event)}
									onDragStart={() => dragStartHandler(board, item)}
									onDragEnd={event => dragEndHandler(event)}
									onDrop={event => dropHandler(event, board, item)}
									className={style.item}
									draggable={true}
								>
									{itemTitle}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};
