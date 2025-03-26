import { Step } from "../components/MultiForm/MultiForm";


export function setItem(key: string, data: string) {
  data = JSON.stringify(data);
  return localStorage.setItem(key, data);
}

export function getItem<T>(key: string): Promise<T | null> {
  return new Promise((resolve, reject) => {
    const data = localStorage.getItem(key);
    if (data !== null) {
      resolve(JSON.parse(data));
    } else {
      resolve(null);
    }
  });
}

export function removeItem(key: string) {
  return localStorage.removeItem(key);
}
interface UserData {
  Token: string;
  Member_id: string;
  Member_type: string;
  Member_fullname: string;
  members_profile_picture: string;
  IsEmployer: string;
  IsEmployee: string;
  is_specialist: string;
  employeeId?: string;
  employee_status?: string;
  token_type?: string;
  subscription_status?: string;
  currency?: string;
  country?: string;
}
export function setUserData(data: UserData): void {
  if (data && typeof data === "object") {
    const dataString = JSON.stringify(data);
    localStorage.setItem("userData", dataString);
  } else {
    console.error("Invalid data for userData:", data);
  }
}


export function getUserData(key: string): UserData | null {
  try {
    const serializedData = localStorage.getItem(key);
    if (!serializedData) {
      return null;
    }
    // Attempt to parse the JSON safely
    const userData: UserData = JSON.parse(serializedData);
    return userData;
  } catch (error) {
    console.error("Error retrieving data from local storage:", error);
    // Clear corrupted data
    localStorage.removeItem(key);
    return null;
  }
}


export async function clearUserData() {
  localStorage.removeItem("userData");
  window.location.replace("/");
}

export const generateDefaultValues = (steps: Step[]) => {
  const defaultValues: { [key: string]: any } = {};

  steps.forEach((step) => {
    step.questions.forEach((question) => {
      if (question.name) {
        switch (question.type) {
          case 'checkbox':
          case 'radio':
          case 'select':
            defaultValues[question.name] = question.multiple ? [] : '';
            break;
          case 'date':
            defaultValues[question.name] = null;
            break;
          case 'file':
            defaultValues[question.name] = question.multiple ? [] : null;
            break;
          case 'textarea':
          case 'text':
            defaultValues[question.name] = question.multiple ? [{ value: '' }] : '';
            break;
          default:
            break;
        }
      }
      else if (question.sub_questions) {
        question.sub_questions.forEach((subquestion: { type: any; name: string | number; multiple: any; }) => {
          switch (subquestion.type) {
            case 'radio':
              defaultValues[subquestion.name] = subquestion.multiple ? [] : '';
              break;
            case 'salary_picker':
              defaultValues[subquestion.name] = subquestion.multiple ? [] : '';
              break;
            case 'select':
              defaultValues[subquestion.name] = subquestion.multiple ? [] : '';
              break;
            default:
              break;
          }
        })
      }
    })
  });

  return defaultValues;
};
