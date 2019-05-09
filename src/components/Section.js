import React, { useState } from 'react';
import { withTheme } from 'styled-components';
import { Box, CheckBox, Collapsible, Heading } from 'grommet';

// TODO add this to Axis
export const Section = withTheme(props => {
  const { title, collapsibleLabel, collapsed, onCollapse, children, theme, headingLevel, ...rest } = props;
  const [opened, open] = useState(!collapsed);

  const { heading } = theme.section;

  return (
    <Box {...rest}>
      <Box direction="row" gap={heading.gap}>
        <Heading style={{ minWidth: '100px' }} level={headingLevel || heading.level}>{title}</Heading>
        {collapsibleLabel && (
          <CheckBox
            label={collapsibleLabel}
            checked={opened}
            onChange={ev => onCollapse ? onCollapse(ev.target.checked) : open(ev.target.checked)}
          />
        )}
      </Box>
      <Collapsible open={opened}>{children}</Collapsible>
    </Box>
  );
});
