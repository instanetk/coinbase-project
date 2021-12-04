import { FC, useCallback, useEffect, useState, useContext } from 'react';
import { useTitle } from '../../common/Hooks';
import { useParams } from 'react-router-dom';
import CampaignView from './CampaignView';
import { ICampaign } from '../../interfaces';
import { getFundraiseById, postFaves } from '../../services/fundraiserService';
import { AuthContext } from '../../context/AuthContext';

const CampaignController: FC = () => {
  const user = useContext(AuthContext);

  const defaulState: ICampaign = {
    title: '',
    story: '',
    image_url: '',
    category: '',
    goal_amount: 1,
    current_amount: 0,
    published: false,
    owner: '',
    email: '',
    _id: '',
    date: new Date(),
  };

  const [campaign, setCampaign] = useState<ICampaign>(defaulState);

  const { id } = useParams<string>();

  const fetchData = useCallback(async () => {
    try {
      if (id !== undefined) {
        let { data } = await getFundraiseById(id);
        setCampaign(data);
      }
    } catch (ex: any) {
      console.log(ex.message);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const giveFaves = async (id: string) => {
    await postFaves(id);
    fetchData();
  };

  useTitle(campaign.title);

  let loggedUser;
  let owner = false;
  if (user !== null) {
    loggedUser = user.uid;
    owner = loggedUser === campaign.owner;
  }

  return <CampaignView campaign={campaign} giveFaves={giveFaves} owner={owner} />;
};

export default CampaignController;
