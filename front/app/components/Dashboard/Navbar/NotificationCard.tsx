import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGlobalState } from '../../Sign/GlobalState';

const NotificationCard = (props : any) => {
  const {state} = useGlobalState();
  const router = useRouter();

  const hanndleClick = () => {
    if (props.not?.type === "REQUEST") {
      if (props.not?.sender_id === state?.user?.id) {
        router.push(`/Dashboard`);
        return;
      }
      router.push(`/Dashboard/Profile?id=${props.not?.sender_id}`);
    }
    props.setOpen(false);
  }

  
  const notificationTime = new Date(props.not?.createdAt);

  const now = new Date();

  const timeDiff = now.getTime() - notificationTime.getTime();

  function formatTimeDiff(diffInMs: number): string {
    if (diffInMs < 60 * 1000) {
      const seconds = Math.floor(diffInMs / 1000);
      return `${seconds} seconds ago`;
    } else if (diffInMs < 3600 * 1000) {
      const minutes = Math.floor(diffInMs / (60 * 1000));
      return `${minutes} minutes ago`;
    } else if (diffInMs < 24 * 3600 * 1000) {
      const hours = Math.floor(diffInMs / (3600 * 1000));
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(diffInMs / (24 * 3600 * 1000));
      return `${days} days ago`;
    }
  }
  return (
    <div onClick={hanndleClick}>
        <button className="flex items-center w-full gap-4 px-3 py-2 pl-2 pr-8 leading-tight transition-all rounded-md outline-none cursor-pointer select-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
          <Image alt="paypal" src={props.not?.sender_picture || "https://dwglogo.com/wp-content/uploads/2016/08/PayPal_Logo_Icon.png"}
            className="relative inline-block h-12 w-12 !rounded-full  object-cover object-center" width={100} height={100} />
          <div className="flex flex-col gap-1">
            <p className="block font-sans text-sm antialiased font-semibold leading-normal text-black">
              {props.not?.type === "REQUEST" ? "New friend request" : "New message"} from {props.not?.sender_name}
            </p>
            <p className="flex items-center gap-1 font-sans text-sm antialiased font-medium text-gray-500">
              <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M7.99998 14.9C9.69736 14.9 11.3252 14.2257 12.5255 13.0255C13.7257 11.8252 14.4 10.1974 14.4 8.49998C14.4 6.80259 13.7257 5.17472 12.5255 3.97449C11.3252 2.77426 9.69736 2.09998 7.99998 2.09998C6.30259 2.09998 4.67472 2.77426 3.47449 3.97449C2.27426 5.17472 1.59998 6.80259 1.59998 8.49998C1.59998 10.1974 2.27426 11.8252 3.47449 13.0255C4.67472 14.2257 6.30259 14.9 7.99998 14.9ZM8.79998 5.29998C8.79998 5.0878 8.71569 4.88432 8.56566 4.73429C8.41563 4.58426 8.21215 4.49998 7.99998 4.49998C7.7878 4.49998 7.58432 4.58426 7.43429 4.73429C7.28426 4.88432 7.19998 5.0878 7.19998 5.29998V8.49998C7.20002 8.71213 7.28434 8.91558 7.43438 9.06558L9.69678 11.3288C9.7711 11.4031 9.85934 11.4621 9.95646 11.5023C10.0536 11.5425 10.1577 11.5632 10.2628 11.5632C10.3679 11.5632 10.472 11.5425 10.5691 11.5023C10.6662 11.4621 10.7544 11.4031 10.8288 11.3288C10.9031 11.2544 10.9621 11.1662 11.0023 11.0691C11.0425 10.972 11.0632 10.8679 11.0632 10.7628C11.0632 10.6577 11.0425 10.5536 11.0023 10.4565C10.9621 10.3593 10.9031 10.2711 10.8288 10.1968L8.79998 8.16878V5.29998Z"
                  fill="#90A4AE"></path>
              </svg>
              <span>{formatTimeDiff(timeDiff)}</span>
            </p>
          </div>
        </button>
    </div>
  )
}

export default NotificationCard