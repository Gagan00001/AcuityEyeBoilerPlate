import {
  useLocation,
  useNavigate,
  useMatch,
  generatePath,
} from "react-router-dom";

function useRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const match = useMatch('/');
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
    params: match.params,
    url: match.url,
    push: navigate,
    goBack: () => navigate(-1),
    location,
    replace: navigate,
    path: match.path,
    generatePath,
    query,
  };
}

export default useRedirect;
