# 🍻 Chee-Us
### 건배 Cheers!
### 함께 취해요 취-어스!
![image](https://github.com/user-attachments/assets/3d7e5457-7fd8-4db9-adf1-d4d025547695)

혼술 하기 싫은 날, 함께 술을 마실 친구를 구할 수 있는 동네 술 친구 매칭 웹사이트 입니다.

> [Front-end GitHub](https://github.com/Coscle/CheeUs_Frontend)
>
> [Back-end  GitHub](https://github.com/Coscle/CheeUs_Backend)

<br>

## 1. 프로젝트 소개

- 지도 위치정보를 기반으로 동네 술 친구를 찾는 웹 앱 입니다.
- 프로필 카드의 거리와 술 취향을 보고 스와이프 하여 매칭된 유저와 1:1 실시간 채팅을 통해 술 취향이 같은 술 친구를 구할 수 있습니다.
- 특정 날짜와 시간을 선택해 술 모임을 열고, 모임 참여 유저들과  단체 채팅을 통해 소통할 수 있습니다.
- 일반 / 숏폼 게시판 등응 사용해 다양한 컨텐츠를 공유하고 즐길 수 있으며, 이벤트 참여나 매거진 을 통해 재미와 정보를 얻을 수 있습니다.
- Admin을 사용해 관리자가 유저와 게시글을 관리하고, 매거진과 이벤트 글을 작성할 수 있습니다.
<br>

## 2. 주요 페이지 미리보기
<div align="center">
  <table style="border-collapse: collapse; width: 50%; height: 50%;">
    <tr>
      <td style="width: 50%; height: 50%; text-align: center;">
        <img src="https://github.com/user-attachments/assets/cca048c7-0bb0-45d5-92d7-e510d4639e87"
             style="width: 100%; height: 100%; object-fit: cover;" alt="Image 1"/>
      </td>
      <td style="width: 50%; height: 50%; text-align: center;">
        <img src="https://github.com/user-attachments/assets/e5d0ae7f-f6c4-40b1-9ba4-e9d82909e101" 
             style="width: 100%; height: 100%; object-fit: cover;" alt="Image 2"/>
      </td>
       <td style="width: 50%; height: 50%; text-align: center;">
        <img src="https://github.com/user-attachments/assets/9ec2f0ef-2aec-4967-9db7-d8b6c65e0f0b""
             style="width: 100%; height: 100%; object-fit: cover;" alt="Image 3"/>
      </td>
    </tr>
    <tr>
      <td style="width: 50%; height: 50%; text-align: center;">
        <img src="https://github.com/user-attachments/assets/89c92a68-3f97-49ef-8900-70e905578ddd" 
             style="width: 100%; height: 100%; object-fit: cover;" alt="Image 3"/>
      </td>
      <td style="width: 50%; height: 50%; text-align: center;">
        <img src="https://github.com/user-attachments/assets/06a82b88-3829-49e8-a286-90aef6af844b" 
             style="width: 100%; height: 100%; object-fit: cover;" alt="Image 4"/>
      </td>
      <td style="width: 50%; height: 50%; text-align: center;">
        <img src="https://github.com/user-attachments/assets/cab56f8f-b21d-44a7-811f-74a4dcdaa324"" 
             style="width: 100%; height: 100%; object-fit: cover;" alt="Image 4"/>
      </td>
    </tr>
  </table>
</div>

<br/>

## 3. 팀원 구성 및 역할

<div align="center" width="100%">

<table style="border-collapse: collapse; width: 100%;">
  <tr>
    <th style="text-align: center;">이름</th>
    <th style="text-align: center;">포지션</th>
    <th style="text-align: center;">담당업무</th>
  </tr>
  <tr>
    <td style="text-align: center;">
      <strong>고규리</strong><br/><br/>
      <img src="https://github.com/user-attachments/assets/9d03d528-6df5-4b38-9d46-2828ce433f47" 
           style="height: 150px; width: 150px; border-radius: 50%;" 
           alt="고규리"/><br/>
      <a href="https://github.com/gogxxri">@gogxxri</a>
    </td>
    <td style="text-align: center;">Front-end</td>
    <td style="text-align: center;">
      - 전체적인 UI / UX<br/>
      - 메인페이지 / 회원정보 수정<br/>
      - 마이페이지 / 유저 페이지 / 회원 정보 수정<br/>
      - 1:1 스와이프 매칭 페이지<br/>
      - SocketIo & nodeJs를 사용한 1:1 채팅 및 단체채팅 실시간 구현<br/>
      - 게시판 CRUD 페이지 구현<br/>
      - 댓글 / 대댓글 기능 구현
    </td>
  </tr>
  <tr>
    <td style="text-align: center;">
      <strong>이도현</strong><br/><br/>
      <img src="https://avatars.githubusercontent.com/u/162306616?v=4" 
           style="height: 150px; width: 150px; border-radius: 50%;" 
           alt="이도현"/><br/>
      <a href="https://github.com/bbott0">@bbott0</a>
    </td>
    <td style="text-align: center;">Front-end</td>
    <td style="text-align: center;">
      - OAuth 사용한 회원가입 페이지<br/>
      - 카카오지도 API를 활용<br/>
      - 지도 API를 활용한 모임 게시판(함께 마셔요) CRUD 페이지 구현<br/>
      - Admin 페이지 구현<br/>
      - Admin을 활용한 이벤트 / 매거진 페이지 구현
    </td>
  </tr>
  <tr>
    <td style="text-align: center;">
      <strong>김민상</strong><br/><br/>
      <img src="https://avatars.githubusercontent.com/u/147994370?v=4" 
           style="height: 150px; width: 150px; border-radius: 50%;" 
           alt="김민상"/><br/>
      <a href="https://github.com/satorufan">@satorufan</a>
    </td>
    <td style="text-align: center;">Back-end</td>
    <td style="text-align: center;">
      - Spring / React 환경 구축<br/>
      - DB 생성 및 관리<br/>
      - 로그인 / 회원가입(OAuth) 로직 구현<br/>
      - 스크랩 / 회원정보 수정 로직 구현<br/>
      - 1:1 매칭 로직 구현<br/>
      - 채팅방 생성<br/>
      - 프로젝트 배포
    </td>
  </tr>
  <tr>
    <td style="text-align: center;">
      <strong>성연서</strong><br/><br/>
      <img src="https://avatars.githubusercontent.com/u/170899887?v=4" 
           style="height: 150px; width: 150px; border-radius: 50%;" 
           alt="성연서"/><br/>
      <a href="https://github.com/aBiteOfPizza">@aBiteOfPizza</a>
    </td>
    <td style="text-align: center;">Back-end</td>
    <td style="text-align: center;">
      - 게시글 CRUD 비즈니스 로직 구현<br/>
      - 좋아요 / 신고 로직 구현<br/>
      - 댓글 / 대댓글 로직 구현<br/>
      - DB 생성 및 관리<br/>
      - Admin 페이지 및 기능 구현
    </td>
  </tr>
  <tr>
    <td style="text-align: center;">
      <strong>신상우</strong><br/><br/>
      <img src="https://avatars.githubusercontent.com/u/108801361?v=4" 
           style="height: 150px; width: 150px; border-radius: 50%;" 
           alt="신상우"/><br/>
      <a href="https://github.com/Coscle">@Coscle</a>
    </td>
    <td style="text-align: center;">Back-end <br/> 팀장</td>
    <td style="text-align: center;">
      - 프로젝트 총괄<br/>
      - 테스트 케이스 관리<br/>
      - 각 기능 로직 병합<br/>
      - Firebase 연동 및 관리<br/>
      - TostEditor에서 사진 / 동영상 분리 및 불러오기<br/>
      - 프로젝트 배포
    </td>
  </tr>
</table>

</div>

<br>

## 4. 개발 환경

- **Front-end** : React, Redux-Toolkit
- **Back-end** : SpringBoot, MyBatis
- **DataBase** : MYSQL, MONGODB, REDIS, FIREBASE
- 버전 및 이슈관리 : Github
- 협업 툴 : Discord, Figma
- 서비스 배포 환경 : NCP

<br>

## 5. 개발기간

- 전체 개발 기간 : 2024-06-28 ~ 2024-08-22
- 기획 및 설계 : 2024-06-28 ~ 2024-07-07
- 기능 구현 : 2024-07-08 ~ 202-08-12
- 테스트 및 배포 : 2024-08-13 ~ 2024-08-22

## 6. 데모 영상 및 페이지별 기능
### [데모영상 바로가기]
<p align="center"><strong>일반 유저</strong></p>

<p align="center">
    <a href="https://youtu.be/VHh2DHvB9l8">
        <img src="http://img.youtube.com/vi/VHh2DHvB9l8/0.jpg" alt="Video Label">
    </a>
</p>

<p align="center"><strong>Admin</strong></p>

<p align="center">
    <a href="https://youtu.be/xdaZuTFELiU">
        <img src="http://img.youtube.com/vi/xdaZuTFELiU/0.jpg" alt="Video Label">
    </a>
</p>

### [초기화면]
- 메인페이지
- 로그인 여부에 따라 상단 NavBar의 구성이 달라짐
  
<br>

### [회원가입]
- 카카오 / 네이버 / 구글 OAuth 회원가입
- JWT 토큰을 사용해 로그인을 유지
- Redis를 활용하여 전화번호 인증을 구현

<br>

### [마이페이지 / 회원정보 수정]
- 마이페이지에서 내 프로필카드 확인
- 찜한 목록, 내가 쓴 글 목록 확인 및 해당 게시물로 이동 가능
- 사진, 자기소개, 위치동의, 매칭 동의 등 정보 수정 가능

<br>


### | 유저 프로필 |
- 게시물, 댓글, 채팅방 등에서 닉네임 또는 프로필 사진을 누르면 해당 유저 프로필 페이지로 이동
- 프로필 페이지에서 해당 유저의 정보를 확인 가능
- 해당 유저 신고 및 좋아요 가능
  
<br>


### | 둘이 마셔요 (1:1 채팅) |
- 위치정보와 매칭 서비스 동의 사용자만 사용 및 프로필 카드 노출 가능
- 다른 유저들의 사진, 술 취향, 거리, 나이, 자기 소개 등을 담은 프로필 카드를 무작위로 섞음
- 프로필 카드를 스와이프와 버튼을 통해 해당 유저를 Like 또는 Nope으로 처리
- 서로 Like를 한 유저 간 1:1 매칭이 성사되며 채팅방이 생성
 
<br>

### | 함께 마셔요 (모임 게시판) |
- 카카오 지도 API를 사용하여 모임 장소를 선택
- 특정 날짜와 위치에 맞추어 술 모임을 개설
- 각 게시물 별로 하트와 스크랩 가능
- 게시물 작성 시 단체 채팅방이 생성되며, 유저들은 게시물 상세보기에서 채팅방에 참여를 할 수 있음
  
<br>

### | 1:1 채팅 |
- 1:1 매칭이 성사된 유저들 간의 실시간 채팅
- 리스트에서 유저 검색 가능
- 리스트에서 유저를 선택하면 해당 유저와 채팅 가능
- 채팅방 나가기 및 해당 유저 신고하기 기능
- 새 메세지 수신 시 리스트에 New 표시 / 상단 Header에 dot 표시
  
<br>

### | 단체 채팅 |
- 함께 마셔요 게시판을 통해 생성된 단체 모임 채팅방
- 상단 모달창에서 해당 게시판 참여 유저 및 참여 인원 수를 알 수 있음
- 모달창에서 유저 신고 가능
- 방장의 경우 강제퇴장 기능 사용 가능
- 채팅방 나가기 기능
- 새 메세지 수신 시 리스트에 New 표시 / 상단 Header에 dot 표시
  
<br>

### | 단체 채팅 |
- 함께 마셔요 게시판을 통해 생성된 단체 모임 채팅방
- 상단 모달창에서 해당 게시판 참여 유저 및 참여 인원 수를 알 수 있음
- 모달창에서 유저 신고 가능
- 방장의 경우 강제퇴장 기능 사용 가능
- 강퇴된 유저는 재입장 불가
- 채팅방 나가기 기능
- 새 메세지 수신 시 리스트에 New 표시 / 상단 Header에 dot 표시
  
<br>

### | 일반 게시판(자유 / 숏폼 / 이벤트 참여) |
- ToastUI를 사용하여 글과 사진을 함께 업로드 가능
- 게시글 작성, 수정, 삭제 가능
- 게시물 별 좋아요, 스크랩, 조회수 확인 가능
- 댓글과 대댓글 사용 가능

#### 자유 게시판
- 자유롭게 이야기를 나눌 수 있는 커뮤니티
  
<br>

#### 숏폼 게시판
- 50MB 미만, 1분 미만의 숏폼을 업로드 할 수 있는 커뮤니티

<br>

#### 이벤트 참여 게시판
- 관리자가 생성한 이벤트의 참여에 참여할 수 있는 게시판

<br>

### | 이벤트 |
- 관리자가 사업주로부터 광고 의뢰 받은 이벤트 혹은 CheeUs 자체 이벤트가 등록된 게시판
  
<br>

### | 매거진 |
- 관리자가 어드민에서 제공하는 술 관련 이모저모
- Pop-Up 스토어 안내
- 술과 관련된 TMI 정보 제공
- 다양한 술 레시피 공유
- 술집 추천
  
<br>

### | 어드민 |
- 관리자가 유저 정보와 게시물 관리를 할 수 있는 어드민 페이지
- 신고 유저 블랙리스트 처리
- 유해 게시물 히든
- 게시물 상단고정 pin 설정
- 매거진과 이벤트 게시물 등록, 수정, 삭제
