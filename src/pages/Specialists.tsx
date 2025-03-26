import { CmsHeader } from "../components/CmsHeader/CmsHeader";
import { VideoCard } from "../components/VideoCard/VideoCard";
import { useSpecialistMutation } from "../features/Specialist/SpecialistApiSlice";
import { useEffect, useState } from "react";
import { getUserData } from "../utils/Utils";
import { MODAL_TYPES, useGlobalModalContext } from "../utils/GlobalModal";
import { selectSpecialist, setSpecialist } from "../features/Specialist/SpecialistSlice";
import { useDispatch, useSelector } from "react-redux";

interface VideoData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  bio?: string;
  videos: number | '';
  location: string | '';
  videoUrl: string | '';
}

interface Specialist {
  id: number;
  members_profile_picture: string;
  members_fname: string;
  members_lname: string;
  members_employment: string;
  total_videos: number;
  members_biography: string
}

const Specialists = () => {
  const baseUrl = process.env.REACT_APP_STORAGE_URL;
  const dispatch = useDispatch();
  const userData = getUserData("userData");
  let memberType = "";
  let token = "";
  try {
    if (userData !== null) {
      token = userData.Token;
      memberType = userData.Member_type;
    } else {
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  const { showModal } = useGlobalModalContext();
  const memberModal = () => {
    showModal(MODAL_TYPES.MEMBERSHIP_MODAL);
  };
  // useEffect(() => {
  //   if (!memberType) memberModal();
  // }, []);

  const [videodatas, setVideodatas] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const stripHtmlTags = (str: string) => {
    if (!str) return '';
    return str.replace(/<\/?[^>]+(>|$)/g, "");
  };
  const [specialistMutation] = useSpecialistMutation();



  // Function to fetch specialist list from the API
  const fetchSpecialistFromAPI = async () => {
    setIsLoading(true);
    try {
      const response = await specialistMutation(token);
      if ("error" in response) {
        throw new Error("Failed to fetch specialist list");
      }

      const data = await response.data.data;

      dispatch(setSpecialist({ list: data }));

    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  const specialistList = useSelector(selectSpecialist);

  useEffect(() => {
    const transformedData = (specialistList || []).map((item: {
      id: number;
      members_profile_picture: string;
      members_fname: string;
      members_lname: string;
      members_employment: string;
      total_videos: number;
      members_biography: string
    }) => ({
      id: item.id,
      image: item.members_profile_picture ? `${baseUrl}/${item.members_profile_picture}` : '',
      title: `${item.members_fname} ${item.members_lname}`,
      subtitle: item.members_employment,
      videos: item.total_videos,
      location: '', // Set location if available
      bio: stripHtmlTags(item.members_biography),
    }));

    setVideodatas(transformedData);
  }, [specialistList]);


  useEffect(() => {
    // if (!memberType) memberModal();
    fetchSpecialistFromAPI();
  }, []);



  return (
    <div className="specialists-page">
      <CmsHeader links={[]}></CmsHeader>
      <div className="specialists-video-list specialist-videopagelist">
        <div className="box-container">
          <div className="row">
            {videodatas.map((videoData) => (
              <div className="col-md-4 col-6" key={videoData.id}>
                <VideoCard data={videoData} target={`/specialists-details/${videoData.id}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Specialists;
