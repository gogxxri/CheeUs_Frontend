import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import PushPinIcon from '@mui/icons-material/PushPin';
import Chip from '@mui/material/Chip';
import Pagination from '@mui/material/Pagination';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import BoardSkeleton from '../skeleton/BoardSkeleton';
import BoardTop from '../board/BoardTop';
import { selectBoards, toggleLike, selectLikedMap, filterBoards, setSearchQuery, selectFilteredBoards, fetchBoards, selectBoardAuthors, fetchBoardsAuthor } from '../../store/BoardSlice';
import '../freeboard/freeBoard.css';

const BoardList = ({ category }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const boards = useSelector(selectBoards);
  const authors = useSelector(selectBoardAuthors);
  const likedMap = useSelector(selectLikedMap);
  const filteredBoards = useSelector(selectFilteredBoards);
  
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if(category === 1){
        dispatch(fetchBoards('freeboard'));
    } else if (category === 3){
        dispatch(fetchBoards('eventboard'));
    } else if (category === 2){
        dispatch(fetchBoards('shortform'));
    }
  }, [dispatch, category]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    dispatch(setSearchQuery(query));
    dispatch(filterBoards());
  }, [location.search, dispatch]);

  const handleLikeClick = (id) => {
    dispatch(toggleLike(id));
  };

  const handleCardClick = (id) => {
    const boardData = boards.find(board => board.id === id);
    if(category === 1){
       navigate(`/board/freeboard/detail/${id}`, {state: {boardData}});
    } else if (category === 3){
        navigate(`/board/eventboard/detail/${id}`, {state: {boardData}});
    }
  };

  const handleCreatePost = () => {
    if(category === 1) {
        navigate(`/board/freeboard/write`);
    } else if(category === 3) {
        navigate(`/board/eventboard/write`);
    } else if(category === 2) {
        navigate(`/board/shortform/write`);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleBoards = filteredBoards.filter(board => !board.hidden);
  const pinnedBoards = visibleBoards.filter(board => board.category === category && board.pinned);
  const regularBoards = visibleBoards.filter(board => board.category === category && !board.pinned);
  const currentBoards = [...pinnedBoards, ...regularBoards].slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(visibleBoards.filter(board => board.category === category).length / itemsPerPage);

  function arraysEqualAsSets(arr1, arr2) {
    return new Set(arr1).size === new Set([...arr1, ...arr2]).size;
  }

  const perPageAuthors = [];
  currentBoards?.map(board => {
    if (!perPageAuthors.includes(board.author_id)) perPageAuthors.push(board.author_id);
  });

  useEffect(() => {
    if (currentBoards.length > 0 && !arraysEqualAsSets(Object.keys(authors), perPageAuthors)) {
      dispatch(fetchBoardsAuthor({ category, perPageBoards: currentBoards }));
    }
  }, [dispatch, currentBoards, boards, category]);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <BoardTop />
      {filteredBoards[0] !== -1 ? (
      <div className="freeboard-container">
        <div className="freeboard-card-container">
          {arraysEqualAsSets(Object.keys(authors), perPageAuthors) ? currentBoards.map((board) => {

            const contentWithoutImages = board.content.replace(/!\[.*?\]\(https:\/\/[^\s]+\)/g, '');

            const thumbnailMatch = board.content.match(/!\[.*?\]\((https:\/\/[^\s]+)\)/);
            const thumbnail = thumbnailMatch ? thumbnailMatch[1] : null;

            return (
              <Card
                key={board.id}
                variant="plain"
                className="freeboard-card"
                onClick={() => handleCardClick(board.id)}
              >
                {board.pinned && (
                  <Box className="pinned-icon-container">
                    <PushPinIcon className="pinned-icon" />
                    <Chip label="공지" size="small" className="notice-chip" />
                  </Box>
                )}
                <Box className="card-video">
                  <AspectRatio ratio="4/3">
                    {thumbnail ? (
                      <CardCover className="card-cover">
                        <img
                          src={thumbnail || board.photoes}
                          alt="게시물 사진"
                          className="card-photo"
                          style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
                        />
                        <div className="card-overlay-text">
                          {contentWithoutImages}
                        </div>
                      </CardCover>
                    ) : (
                        <div className="content-text">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                            {contentWithoutImages}
                          </ReactMarkdown>
                        </div>
                    )}
                  </AspectRatio>
                </Box>
                <Box>
                  <div className="freeboard-title">
                    {board.title}
                  </div>
                </Box>
                <Box className="card-content">
                  <div className="nick-avature">
                    <Avatar
                      src={authors[board.author_id]}
                      size="sm"
                      sx={{ '--Avatar-size': '1.5rem' }}
                      className="card-avatar"
                    />
                    <div>
                      <div className='short-author'>
                        {board.nickname}
                      </div>
                    </div>
                  </div>
                  <div className="card-icons-container-list">
                    <div className="card-icon">
                      <Favorite color="action" />
                      {board.like}
                    </div>
                    <div className="card-icon">
                      <Visibility />
                      {board.views}
                    </div>
                  </div>
                </Box>
              </Card>
            );
          }) : <BoardSkeleton />}
        </div>
      </div>) : (<div className="permissionMessage" >
          <p>게시글이 존재하지 않습니다.<br/> 첫 게시글의 주인공이 되어 보세요~!</p>
        </div>)}
      <div className="create-post-container">
        <button onClick={handleCreatePost} className="create-post-button">
          게시글 작성
        </button>
      </div>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        variant="outlined"
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'black',
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: 'black',
            color: 'white',
          },
          '& .MuiPaginationItem-root:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        }}
        className="pagination"
      />
    </>
  );
};

export default BoardList;
