import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 초기 상태
const initialState = {
    userLocation: null,
    likedProfiles: [],
    userProfile: null,
    otherProfile: null,
    status: 'idle', // 요청 상태
    otherStatus : 'idle',
    error: null, // 오류 정보
    otherError: null
};


// 사용자 프로필을 가져오는 thunk
export const fetchUserProfile = createAsyncThunk(
    'profile/fetchUserProfile',
    async ({ serverUrl, memberEmail, token }) => {
        
        if (memberEmail && token) {
            const response = await axios.get(`${serverUrl}/profile`, {
                params: { email: memberEmail },
                headers : {
                    "Authorization" : `Bearer ${token}`
                },
                withCredentials : true
            });
            
            const imageBlob = [];
            for(let i=0 ; i < response.data.profile.photo ; i ++){
                // imageBlob.push("data:" + response.data.imageType[i]
                //     + ";base64," + response.data.imageBlob[i] );
                imageBlob.push(response.data.imageType[i]);
            }
            const scrapList = response.data.scrap.map((scrap)=> {
                if (scrap.boardId > 0) return {id : scrap.boardId, type : "[일반게시판]", title : scrap.title, url : scrap.url}
                if (scrap.eventId > 0) return {id : scrap.eventId, type : "[이벤트게시판]", title : scrap.title, url : scrap.url}
                if (scrap.magazineId > 0) return {id : scrap.magazineId, type : "[매거진]", title : scrap.title, url : scrap.url}
                if (scrap.togetherId > 0) return {id : scrap.togetherId, type : "[함께마셔요]", title : scrap.title, url : scrap.url}
            })
            // 0 - 함께마셔요, 1 - 자유, 2 - 숏폼, 3 - 이벤트
            const myPostList = response.data.myPost.map((post)=> {
                if (post.category == 0) return {id : post.id, type : "[함께마셔요]", title : post.title, url : `http://localhost:3000/dtboard/post/${post.id}`}
                if (post.category == 1) return {id : post.id, type : "[일반게시판]", title : post.title, url : `http://localhost:3000/board/freeboard/detail/${post.id}`}
                if (post.category == 2) return {id : post.id, type : "[일반게시판]", title : post.title, url : `http://localhost:3000/board/shortform/detail/${post.id}`}
                if (post.category == 3) return {id : post.id, type : "[일반게시판]", title : post.title, url : `http://localhost:3000/board/eventboard/detail/${post.id}`}
            })

            const profile = {
                profile : { 
                    ...response.data.profile,
                    popularity : response.data.popularity,
                    scrap : scrapList,
                    myPost : myPostList
                },
                imageBlob : imageBlob
            };
            return profile; // 프로필 데이터 반환
        }
    }
);

// 사용자 프로필 업데이트 thunk
export const updateUserProfileThunk = createAsyncThunk(
    'profile/updateUserProfile',
    async ({ serverUrl, updateUserProfile, token }) => {
        const formData = new FormData();

        formData.append("memberProfileDetail",
            new Blob([JSON.stringify(updateUserProfile.profile)], 
            {type: 'application/json'})
        );
        console.log(updateUserProfile);

        updateUserProfile.imageBlob.forEach(async (files, index) => {

            if(files.startsWith('data')) {
                var byteCharacters = atob(files.split(',')[1]);
                var byteNumbers = new Array(byteCharacters.length);
                for (var i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                var blob = new Blob([byteArray], { type: files.split(':')[1].split(';')[0] });

                formData.append("photos", blob);
            } else {
                var emptyBlob = new Blob([], { type: 'application/octet-stream' });
                formData.append("photos", emptyBlob, 'emptyfile.txt'); // 파일명은 필요에 따라 설정
            }
            formData.append("email", updateUserProfile.profile.email + "/" + index);
        });

        const response = await axios.post(serverUrl + '/profile/edit', formData, {
            headers : {
                'Content-Type': 'multipart/form-data',
                "Authorization" : `Bearer ${token}`
            },
            withCredentials : true
        }).then((res)=>window.location.reload()).catch((err)=>{console.log(err)});

        const imageBlob = [];
            for(let i=0 ; i < response.data.profile.photo ; i ++){
                // imageBlob.push("data:" + response.data.imageType[i]
                //     + ";base64," + response.data.imageBlob[i] );
                imageBlob.push(response.data.imageType[i]);
            }

        const profile = {
            profile : response.data.profile,
            imageBlob : imageBlob
        };
		console.log("profile : " +  profile);
        return profile; // 프로필 데이터 반환
    }
);

// 다른 사용자 프로필을 가져오는 thunk
export const fetchOtherProfile = createAsyncThunk(
    'profile/fetchOtherProfile',
    async ({ serverUrl, otherEmail, token }) => {

        console.log(otherEmail)
        if (otherEmail && token) {
            const response = await axios.get(`${serverUrl}/profile/others`, {
                params: otherEmail,
                headers : {
                    "Authorization" : `Bearer ${token}`
                },
                withCredentials : true
            });
            const imageBlob = [];
            for(let i=0 ; i < response.data.profile.photo ; i ++){
                // imageBlob.push("data:" + response.data.imageType[i]
                //     + ";base64," + response.data.imageBlob[i] );
                imageBlob.push(response.data.imageType[i]);
            }

            const profile = {
                profile : { 
                    ...response.data.profile,
                    popularity : response.data.popularity
                },
                imageBlob : imageBlob
            };
            return profile; // 프로필 데이터 반환
            // return response.data; // 프로필 데이터 반환
        }
    }
);

const ProfileSlice = createSlice({
    name: 'profile', // 슬라이스 이름
    initialState,
    reducers: {
        updateUserLocation(state, action) {
            state.userLocation = action.payload; // 위치 업데이트
        },
        likeProfile(state, action) {
            const profileId = action.payload;
            if (!state.likedProfiles.includes(profileId)) {
                state.likedProfiles.push(profileId); // 좋아요 추가
            }
        },
        unlikeProfile(state, action) {
            const profileId = action.payload;
            state.likedProfiles = state.likedProfiles.filter(id => id !== profileId); // 좋아요 취소
        },
        setLikedProfiles(state, action) {
            state.likedProfiles = action.payload; // 좋아요 프로필 설정
        },
        updateUserProfile(state, action) {
            state.userProfile = { ...state.userProfile, ...action.payload }; // 프로필 업데이트
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = 'loading'; // 로딩 중
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded'; // 성공
                state.userProfile = action.payload; // 프로필 데이터 저장
                state.error = null; // 오류 초기화
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = 'failed'; // 실패
                state.error = action.error.message; // 오류 메시지 저장
                state.userProfile = null; // 프로필 초기화
            })
            .addCase(fetchOtherProfile.pending, (state) => {
                state.otherStatus = 'loading'; // 로딩 중
            })
            .addCase(fetchOtherProfile.fulfilled, (state, action) => {
                state.otherStatus = 'succeeded'; // 성공
                state.otherProfile = action.payload; // 프로필 데이터 저장
                state.otherError = null; // 오류 초기화
            })
            .addCase(fetchOtherProfile.rejected, (state, action) => {
                state.otherStatus = 'failed'; // 실패
                state.otherError = action.error.message; // 오류 메시지 저장
                state.otherProfile = null; // 프로필 초기화
            })
            .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
                state.userProfile = action.payload; // 업데이트된 프로필 저장
            });
    },
});

// 액션 내보내기
export const {
    updateUserLocation,
    likeProfile,
    unlikeProfile,
    setLikedProfiles,
    updateUserProfile,
} = ProfileSlice.actions;

// 선택자 내보내기
export const selectUserProfile = (state) => state.profile.userProfile;
export const selectOtherProfile = (state) => state.profile.otherProfile;
export const selectProfileStatus = (state) => state.profile.status;
export const selectProfileError = (state) => state.profile.error;

export default ProfileSlice.reducer;
