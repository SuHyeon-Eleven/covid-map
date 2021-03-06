import React, { useState, useEffect } from "react";
import {
  Seoul,
  Gyeonggi,
  Incheon,
  Gangwon,
  Chungnam,
  Chungbuk,
  Sejong,
  Daejeon,
  Gyeongnam,
  Gyeongbuk,
  Jeonbuk,
  Jeonnam,
  Ulsan,
  Busan,
  Daegu,
  Gwangju,
  Jeju,
} from "./area/all_area";
import axios from "axios";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {changeTheme} from "./redux/action";
import {Button} from "react-bootstrap";

// 코로나 단계별 색상
const fillColor = ["#4088da", "#ffb911", "#fc7001", "#e60000"];

function CovidView({ covidData, onAreaClick }) {
  return (
    <svg width="700px" height="1000px" viewBox="0 0 800 1200">
      <Seoul
        fill={fillColor[covidData["서울"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Gyeonggi
        fill={fillColor[covidData["경기"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Gangwon
        fill={fillColor[covidData["강원"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Incheon
        fill={fillColor[covidData["인천"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Chungnam
        fill={fillColor[covidData["충남"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Chungbuk
        fill={fillColor[covidData["충북"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Sejong
        fill={fillColor[covidData["세종"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Daejeon
        fill={fillColor[covidData["대전"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Gyeongnam
        fill={fillColor[covidData["경남"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Gyeongbuk
        fill={fillColor[covidData["경북"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Jeonbuk
        fill={fillColor[covidData["전북"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Jeonnam
        fill={fillColor[covidData["전남"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Ulsan
        fill={fillColor[covidData["울산"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Busan
        fill={fillColor[covidData["부산"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Daegu
        fill={fillColor[covidData["대구"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Gwangju
        fill={fillColor[covidData["광주"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
      <Jeju
        fill={fillColor[covidData["제주"]["level"] - 1]}
        onClick={(e) => onAreaClick(e.target.id)}
      />
    </svg>
  );
}

const StyleBox = styled.div`
  border-radius: 5px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
  width: 800px;
  padding: 10px;
`;

function CovidInfo({ area,date, todayNum, level }) {
  const theme = useSelector((state) => state.theme);

  return (
    <StyleBox style={{background: theme === "light" ? "white" : "darkgrey"}}>
      {area !== "" && (
        <>
          <h2>{area} 코로나 정보 ({date} 기준)</h2>
          <p>거리두기 단계 : {level}</p>
          <p>확진자 수 : {todayNum}</p>
        </>
      )}
    </StyleBox>
  );
}

const StyleMap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function CovidMap() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);

  const [covidData, setCovidData] = useState(null);
  const [selectArea, setSelectArea] = useState({
    area: "",
    level: 0,
  });
  const [allNum,setAllNum] = useState()

  useEffect(() => {
    if (covidData){
    console.log(covidData);

    const data = covidData.data
    const numArr =Object.keys(data).map(key => {
      return data[key].num
    })
    const allNum = numArr.reduce((a,b)=> a+b)

    setAllNum(allNum)
  }
  }, [covidData]);

  const fetchData = async () => {
    let response = await axios.post("http://localhost:5000/covidData")
    setCovidData(response.data);
    // .then((response) => {
    //   if (response.data) {
    //     setCovidData(response.data);
    //   }
    // });
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      fetchData();
      console.log("갱신 완료.");
    }, 5000);

    return () => {
      clearInterval(timer);
    }
  }, []);
  

  const handlerAreaSelect = (area) => {
    setSelectArea({
      area: area,
      level: covidData.data[area]["level"],
      todayNum: covidData.data[area]["num"],
    });
  };

  const handleTheme = () => {
    dispatch(changeTheme(theme === "light" ? "dark" : "light"));
  }

  return (
    <StyleMap style={{background: theme === "light" ? "white" : "grey"}}>
      {covidData === null ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>총 확신자 수 : {allNum}</p>
          <CovidInfo
            area={selectArea.area}
            date={covidData.updated_data}
            todayNum={selectArea.todayNum}
            level={selectArea.level}
          />
          <CovidView covidData={covidData.data} onAreaClick={handlerAreaSelect} />
        </>
      )}
    </StyleMap>
  );
}
export default CovidMap;
