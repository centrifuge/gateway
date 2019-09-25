import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import AttributeField from '../AttributeField';
import { Attribute, AttrTypes } from '@centrifuge/gateway-lib/models/schema';
import { NumberInput } from '@centrifuge/axis-number-input';
import { DateInput } from '@centrifuge/axis-date-input';
import { Select, TextInput } from 'grommet';

describe('AttributeField', () => {

  it('Should render a DECIMAL ', () => {
    const attr: Attribute = {
      name: 'some_name',
      type: AttrTypes.DECIMAL,
      label: 'Some Input label',
    };
    const component = mount(
      <AttributeField attr={attr}/>,
    );
    const input = component.find(NumberInput);
    expect(input.prop('disabled')).toBeUndefined();
    expect(component.find('label').text()).toEqual(attr.label);
    expect(input.length).toEqual(1);
    expect(input.prop('name')).toEqual(`attributes.${attr.name}.value`);

    component.setProps({
      isViewMode: true,
    });
    expect(component.find(NumberInput).prop('disabled')).not.toBeUndefined();
  });

  it('Should render a INTEGER ', () => {
    const attr: Attribute = {
      name: 'some_name',
      type: AttrTypes.INTEGER,
      label: 'Some Input label',
    };
    const component = mount(
      <AttributeField attr={attr}/>,
    );
    const input = component.find(NumberInput);
    expect(input.prop('disabled')).toBeUndefined();
    expect(component.find('label').text()).toEqual(attr.label);
    expect(input.length).toEqual(1);
    expect(input.prop('name')).toEqual(`attributes.${attr.name}.value`);
    expect(input.prop('precision')).toEqual(0);
    component.setProps({
      isViewMode: true,
    });
    expect(component.find(NumberInput).prop('disabled')).not.toBeUndefined();

  });

  it('Should render a PERCENT ', () => {
    const attr: Attribute = {
      name: 'some_name',
      type: AttrTypes.PERCENT,
      label: 'Some Input label',
    };
    const component = mount(
      <AttributeField attr={attr}/>,
    );
    const input = component.find(NumberInput);
    expect(input.prop('disabled')).toBeUndefined();
    expect(component.find('label').text()).toEqual(attr.label);
    expect(input.length).toEqual(1);
    expect(input.prop('name')).toEqual(`attributes.${attr.name}.value`);
    expect(input.prop('precision')).toEqual(2);
    expect(input.prop('suffix')).toEqual('%');
    component.setProps({
      isViewMode: true,
    });
    expect(component.find(NumberInput).prop('disabled')).not.toBeUndefined();

  });

  it('Should render a STRING ', () => {
    const attr: Attribute = {
      name: 'some_name',
      type: AttrTypes.STRING,
      label: 'Some Input label',
    };
    const component = mount(
      <AttributeField attr={attr}/>,
    );
    const input = component.find(TextInput);
    expect(input.prop('disabled')).toBeUndefined();
    expect(component.find('label').text()).toEqual(attr.label);
    expect(input.length).toEqual(1);
    expect(input.prop('name')).toEqual(`attributes.${attr.name}.value`);
    component.setProps({
      isViewMode: true,
    });
    expect(component.find(TextInput).prop('disabled')).not.toBeUndefined();

  });

  it('Should render a BYTES ', () => {
    const attr: Attribute = {
      name: 'some_name',
      type: AttrTypes.BYTES,
      label: 'Some Input label',
    };
    const component = mount(
      <AttributeField attr={attr}/>,
    );
    const input = component.find(TextInput);
    expect(input.prop('disabled')).toBeUndefined();
    expect(component.find('label').text()).toEqual(attr.label);
    expect(input.length).toEqual(1);
    expect(input.prop('name')).toEqual(`attributes.${attr.name}.value`);
    component.setProps({
      isViewMode: true,
    });
    expect(component.find(TextInput).prop('disabled')).not.toBeUndefined();

  });

  it('Should render a TIMESTAMP ', () => {
    const attr: Attribute = {
      name: 'some_name',
      type: AttrTypes.TIMESTAMP,
      label: 'Some Input label',
    };
    const component = mount(
      <AttributeField attr={attr}/>,
    );
    const input = component.find(DateInput);
    expect(input.prop('disabled')).toBeUndefined();
    expect(component.find('label').text()).toEqual(attr.label);
    expect(input.length).toEqual(1);
    expect(input.prop('name')).toEqual(`attributes.${attr.name}.value`);
    component.setProps({
      isViewMode: true,
    });
    expect(component.find(DateInput).prop('disabled')).not.toBeUndefined();

  });

  it('Should render Select with options instead of input ', () => {
    const attr: Attribute = {
      name: 'some_name',
      type: AttrTypes.STRING,
      label: 'Some Input label',
      options:[
        "1",
        "2",
        "3"
      ]
    };
    const component = mount(
      <AttributeField attr={attr}/>,
    );
    const input = component.find(Select);
    expect(input.prop('disabled')).toBeUndefined();
    expect(component.find('label').text()).toEqual(attr.label);
    expect(input.length).toEqual(1);
    expect(input.prop('options')).toEqual(attr.options);
    component.setProps({
      isViewMode: true,
    });
    expect(component.find(Select).prop('disabled')).not.toBeUndefined();

  });

})
;
