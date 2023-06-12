import {
  useLocation,
  useNavigate,
  useMatch,
  generatePath,
  useParams,
} from "react-router-dom";

function useRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  // const match = useMatch("/");
  const { search } = location;
  const query = {};
  if (search) {
    search
      .substring(1)
      .split("&")
      .forEach((data) => {
        const [key, value] = data.split("=");
        query[key] = decodeURIComponent(value);
      });
  }
  return {
    params: params,
    push: navigate,
    goBack: () => navigate(-1),
    location,
    replace: navigate,
    path: location.pathname,
    generatePath,
    query,
  };
}

export default useRedirect;
