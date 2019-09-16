import React, { FunctionComponent } from 'react';
import { Box, Heading, Paragraph } from 'grommet';
import { AxiosError } from 'axios';


type Props = {
  error: AxiosError;
}
export const PageError: FunctionComponent<Props> = ({ error }) => {

  console.log(JSON.stringify(error));
  console.log(error.code);
  console.log(error.response);
  console.log(error.request);
  console.log(error.config);




  return <Box width={'100%'} align={'center'} justify={'center'} height={'calc(100vh - 90px)'} direction={'row'} gap={'medium'}>
    <Box  border={{side:'right'}} pad={{horizontal:'medium'}}>
      <Heading level={3}>
      {error!.response!.status}
        </Heading>
    </Box>

    <Paragraph>
      {error!.response!.data.message || error!.response!.statusText}
    </Paragraph>
  </Box>;
};
