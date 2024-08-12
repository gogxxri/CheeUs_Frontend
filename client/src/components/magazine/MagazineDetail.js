import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './MagazineDetail.css';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import MagazineTop from './MagazineTop';
import { useMagazines } from './MagazineContext';
import { Bookmark } from '@mui/icons-material';
import { AuthContext } from '../login/OAuth';
import { usePosts } from '../dtboard/PostContext';
import Swal from 'sweetalert2';

const MagazineDetail = () => {
  const { category, id } = useParams();
  const { magazines } = useMagazines();
  const [data, setData] = useState(null);
  const { memberEmail, serverUrl, token } = useContext(AuthContext);
  const [isScrapped, setIsScrapped] = useState(false);
  const { addScrap, checkScrap } = usePosts();

  useEffect(() => {
    if (magazines && magazines.magazine) { // magazines 객체에 magazine 배열이 있는지 확인
      const magazineData = magazines.magazine.find(
          (magazine) => magazine.id.toString() === id && magazine.category === category
      ); // magazine 배열에서 id와 category가 일치하는 항목을 찾음
      setData(magazineData); // 찾은 데이터를 state에 설정
    }
  }, [category, id, magazines]);

  useEffect(() => {
    const fetchData = async () => {
      if (data) {
          try {
              // Check if post is scrapped
              const isPostScrapped = await checkScrap(serverUrl, memberEmail, data.id, token, 4);
              setIsScrapped(isPostScrapped);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
        }
    };
    fetchData();
  }, [data, serverUrl, memberEmail, token]);

  const onScrapHandler = async () => {
    const scrapMessage = await addScrap(serverUrl, memberEmail, id, data.title, token, window.location.href, 4 );
    Swal.fire({
      title: `${scrapMessage}!`,
      icon: '',
      showCancelButton: true,
      confirmButtonColor: '#48088A',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    })
    setIsScrapped(!isScrapped);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="magazine-detail-container">
      <MagazineTop/>
      <div className="magazine-detail-content">
        <h2 className="magazine-detail-title">{data.title}</h2>
        <p className="magazine-detail-date">작성일: {data.writeday}</p>
        <p className="magazine-detail-text">{data.title2}</p>
      	<img src={data.photoes} alt={data.title} className="magazine-detail-image" />
        <p className="magazine-detail-text" dangerouslySetInnerHTML={{ __html: data.content }}></p>
        <div className="magazine-detail-footer">
          <div className="magazine-detail-admin">에디터 : {data.admin_name}<a className = 'hidden'>{data.admin_id}</a></div>
          <div className="magazine-detail-stats">
            <p>
                <Bookmark 
                  color={isScrapped ? 'primary' : 'action'} 
                  onClick={onScrapHandler}
                  style={{ cursor: 'pointer' }}
                /> 
            </p>
            <span className="magazine-detail-likes"><Favorite/>{data.like}</span>
            <span className="magazine-detail-views"><Visibility/>{data.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineDetail;
