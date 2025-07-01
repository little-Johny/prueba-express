import Image from "./../../assets/Home-img.jpg";
import Login from "../../components/Login";

export default function Home() {
  return (
    <div className="hero bg-base-200 w-full h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <img src={Image} alt="home-image" className="w-100" />
        </div>
        <div className="divider divider-horizontal divider-primary"></div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <fieldset className="fieldset">
            <Login />
          </fieldset>
        </div>
      </div>
    </div>
  );
}
