import { GeneralSettings } from "./GeneralSettings";
import { ExpertSettings } from "./ExpertSettings";
import { getUserData } from "../../../utils/Utils";

interface UserData {
    Member_fullname: string;
    Member_type: string;
    Token: string;
    members_profile_picture: string;
    Member_id: string;
    IsEmployer: string;
    IsEmployee: string;
    is_specialist: string;
}
export function Settings() {

    const userData: UserData | null = getUserData("userData");
    let is_specialist = "";
    try {
        if (userData !== null) {
            is_specialist = userData.is_specialist;
        } else {
            console.error("User data not found in local storage");
        }
    } catch (error) {
        console.error("Error parsing user data:", error);
    }

    return (
        <div className="profile-page-content">
            <div className="container profile-div">
                <div style={{ maxWidth: "700px", margin: "auto", display: "block" }}>
                    <GeneralSettings />
                    {is_specialist === "Y" ? (
                        <ExpertSettings />
                    ) : ""}

                </div>
            </div>
        </div>
    );
}
