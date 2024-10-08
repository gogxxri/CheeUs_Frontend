import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectBoards, fetchBoards, fetchBoardsAuthor } from '../../store/BoardSlice';
import DetailBoard from '../board/DetailBoard';
import Repl from '../board/Repl';
import BoardDetailTop from '../board/BoardDetailTop';
import './detailFreeBoard.css';

const DetailFreeBoard = () => {
  const { id } = useParams();
  const boards = useSelector(selectBoards);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBoards('freeboard'));
  }, [dispatch]);
  
  const board = boards.find(b => b.id === parseInt(id) && b.category === 1);

  useEffect(()=>{
    dispatch(fetchBoardsAuthor({category : 'freeboard', perPageBoards : [board]}));
  }, [dispatch, boards]);

  if (!board) return <div>게시물을 찾을 수 없습니다.</div>;

  return (
    <div className="freeContiner">
       <BoardDetailTop category={board.category} />
      <div className="detail-free-container">
        <div className="free-detail-container">
          <DetailBoard board={board} />
        </div>
        <div className="free-detail-repl">
          <Repl boardId={board.id} />
        </div>
      </div>
      </div>

  );
};

export default DetailFreeBoard;
