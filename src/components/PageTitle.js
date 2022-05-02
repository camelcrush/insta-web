import { Helmet } from "react-helmet-async";

const PageTitle = ({ title }) => {
  return (
    <Helmet>
      <title>{title} | Instaclone</title>
    </Helmet>
  );
};

export default PageTitle;
