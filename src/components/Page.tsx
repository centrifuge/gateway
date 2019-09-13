import React, { FunctionComponent, useState } from 'react';
import { withTheme } from 'styled-components';
import { Preloader } from './Preloader';


interface Props {
  render: (props: RenderPros) => React.ReactNode
}

interface RenderPros {
  notify: (message: string) => {}
  setLoading: (flag: boolean) => {}
}

interface State {

}


export const Page: FunctionComponent<Props> = withTheme(props => {
  const { render } = props;
  const [loading, setLoading] = useState<boolean>(true);


  const notify = (message: string) => {
    alert(message);
  };

  return (
    <>
      {loading ?
        <Preloader message={'Loading'}/>
        : render({
          notify,
          setLoading,
        })
      }
    </>

  );
});

