import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { findDOMNode } from 'react-dom';
import { globalKey, getDOMNode, getInstance } from '@test/testUtils';
import Dropdown from '../MultiCascader';
import Button from '../../Button';

const namespace = `${globalKey}-picker`;
const toggleClassName = `.${namespace}-toggle-placeholder`;
const activeClassName = `.${namespace}-check-menu-item-active`;
const itemClassName = `.${namespace}-check-menu-item`;

const items = [
  {
    value: 'abc',
    label: 'abc'
  },
  {
    value: 'abcd',
    label: 'abcd'
  },
  {
    value: 'abcde',
    label: 'abcde',
    children: [
      {
        value: 'abcde-1',
        label: 'abcde-1'
      },
      {
        value: 'abcde-2',
        label: 'abcde-2'
      }
    ]
  }
];

describe('MultiCascader', () => {
  it('Should output a dropdown', () => {
    const instance = getDOMNode(<Dropdown>Title</Dropdown>);

    assert.ok(instance.className.match(/\bpicker-cascader\b/));
  });

  it('Should render number', () => {
    const instance = getDOMNode(
      <Dropdown data={items} value={['abcde-1', 'abcde-2']} classPrefix="rs-picker" />
    );

    assert.equal(instance.querySelector('.rs-picker-value-count').innerText, '1');
  });

  it('Should not render number', () => {
    const instance = getDOMNode(
      <Dropdown
        data={items}
        value={['abcde-1', 'abcde-2']}
        countable={false}
        classPrefix="rs-picker"
      />
    );

    assert.ok(!instance.querySelector('.rs-picker-value-count'));
  });

  it('Should render the parent node by children value', () => {
    const instance = getDOMNode(
      <Dropdown data={items} value={['abcde-1', 'abcde-2']} classPrefix="rs-picker" />
    );

    assert.equal(instance.querySelector('.rs-picker-value-list').innerText, 'abcde (All)');
  });

  it('Should render the parent node by children defaultValue', () => {
    const instance = getDOMNode(
      <Dropdown data={items} defaultValue={['abcde-1', 'abcde-2']} classPrefix="rs-picker" />
    );

    assert.equal(instance.querySelector('.rs-picker-value-list').innerText, 'abcde (All)');
  });

  it('Should render the parent node by children value', () => {
    const instance = getDOMNode(
      <Dropdown
        data={items}
        value={['abcde-1']}
        classPrefix="rs-picker"
        uncheckableItemValues={['abcde-2']}
      />
    );

    assert.equal(instance.querySelector('.rs-picker-value-list').innerText, 'abcde (All)');
  });

  it('Should render the children nodes', () => {
    const instance = getDOMNode(
      <Dropdown
        data={items}
        value={['abcde-1', 'abcde-2']}
        classPrefix="rs-picker"
        uncheckableItemValues={['abcde']}
      />
    );

    assert.equal(instance.querySelector('.rs-picker-value-list').innerText, 'abcde-1,abcde-2');
  });

  it('Should be disabled', () => {
    const instance = getDOMNode(<Dropdown disabled />);

    assert.ok(instance.className.match(/\bdisabled\b/));
  });

  it('Should output a placeholder', () => {
    const placeholder = 'foobar';
    const instance = getDOMNode(<Dropdown placeholder={placeholder} />);

    assert.equal(instance.querySelector(toggleClassName).innerText, placeholder);
  });

  it('Should output a button', () => {
    const instance = getInstance(<Dropdown toggleComponentClass="button" />);
    assert.ok(ReactTestUtils.findRenderedDOMComponentWithTag(instance, 'button'));
  });

  it('Should be block', () => {
    const instance = getDOMNode(<Dropdown block />);

    assert.ok(instance.className.match(/\bblock\b/));
  });

  it('Should output a placeholder by renderValue()', () => {
    const placeholder = 'foobar';
    const instance = getDOMNode(
      <Dropdown renderValue={() => placeholder} data={items} value={['abc']} />
    );

    assert.equal(instance.querySelector('.rs-picker-toggle-value').innerText, placeholder);

    const instance2 = getDOMNode(<Dropdown renderValue={() => placeholder} />);
    assert.equal(instance2.querySelector(toggleClassName).innerText, 'Select');
  });

  it('Should be active by value', () => {
    const value = ['abcd'];
    const instance = getInstance(<Dropdown defaultOpen data={items} value={value} />);
    const menu = findDOMNode(instance.menuContainerRef.current);
    assert.equal(menu.querySelector(activeClassName).innerText, value);
  });

  it('Should be active by defaultValue', () => {
    const value = ['abcd'];
    const instance = getInstance(<Dropdown defaultOpen data={items} defaultValue={value} />);
    const menu = findDOMNode(instance.menuContainerRef.current);
    assert.equal(menu.querySelector(activeClassName).innerText, value);
  });

  it('Should call onSelect callback ', done => {
    const doneOp = () => {
      done();
    };

    const instance = getInstance(<Dropdown data={items} defaultOpen onSelect={doneOp} />);
    const menu = findDOMNode(instance.menuContainerRef.current);
    ReactTestUtils.Simulate.click(menu.querySelector(itemClassName));
  });

  it('Should call onChange callback ', done => {
    const doneOp = value => {
      if (value[0] === 'abc') {
        done();
      }
    };

    const instance = getInstance(<Dropdown data={items} defaultOpen onChange={doneOp} />);
    const menu = findDOMNode(instance.menuContainerRef.current).querySelector(
      `.${namespace}-check-menu-item-wrapper`
    );

    ReactTestUtils.Simulate.click(menu);
  });

  it('Should call onClean callback', done => {
    const doneOp = () => {
      done();
    };
    const instance = getDOMNode(<Dropdown data={items} defaultValue={['abc']} onClean={doneOp} />);

    ReactTestUtils.Simulate.click(instance.querySelector('.rs-picker-toggle-clean'));
  });

  it('Should call `onOpen` callback', done => {
    const doneOp = key => {
      done();
    };
    let picker = null;
    getDOMNode(
      <Dropdown
        ref={ref => {
          picker = ref;
        }}
        onOpen={doneOp}
        data={items}
      />
    );

    picker.open();
  });

  it('Should call `onClose` callback', done => {
    const doneOp = key => {
      done();
    };
    let picker = null;
    getDOMNode(
      <Dropdown
        defaultOpen
        ref={ref => {
          picker = ref;
        }}
        onClose={doneOp}
        data={items}
      />
    );
    picker.close();
  });

  it('Should clean selected default value', () => {
    const instance = getDOMNode(<Dropdown defaultOpen data={items} defaultValue={['abcde-1']} />);

    ReactTestUtils.Simulate.click(instance.querySelector('.rs-picker-toggle-clean'));
    expect(instance.querySelector('.rs-picker-toggle-placeholder').innerText).to.equal('Select');
  });

  it('Should have a custom className', () => {
    const instance = getDOMNode(<Dropdown className="custom" />);
    assert.ok(instance.className.match(/\bcustom\b/));
  });

  it('Should have a custom style', () => {
    const fontSize = '12px';
    const instance = getDOMNode(<Dropdown style={{ fontSize }} />);
    assert.equal(instance.style.fontSize, fontSize);
  });

  it('Should have a custom className prefix', () => {
    const instance = getDOMNode(<Dropdown classPrefix="custom-prefix" />);
    assert.ok(instance.className.match(/\bcustom-prefix\b/));
  });

  it('Should render a button by toggleComponentClass={Button}', () => {
    const instance = getInstance(<Dropdown open data={items} toggleComponentClass={Button} />);
    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'rs-btn');
  });
});
