import React from 'react';
import { useContext, useEffect, useRef } from 'react';
import { WithAsProps } from '@/internals/types';
import { useClassNames } from '@/internals/hooks';
import { mergeRefs } from '@/internals/utils';
import ListContext from './ListContext';
import { Collection } from './helper/useManager';

export interface ListItemProps extends WithAsProps, React.HTMLAttributes<HTMLElement> {
  /* Index of list item, for sort */
  index?: number;

  /* Symbol of collection*/
  collection?: Collection;

  /* disable drag */
  disabled?: boolean;

  /* Size of list item */
  size?: 'lg' | 'md' | 'sm' | 'xs';
}

/**
 * The `List.Item` component is used to specify the layout of the list item.
 * @see https://rsuitejs.com/components/list
 */
const ListItem = React.forwardRef((props: ListItemProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    as: Component = 'div',
    children,
    className,
    classPrefix = 'list-item',
    collection = 0,
    disabled,
    index,
    size: sizeProp,
    ...rest
  } = props;

  const { bordered, register, size: parentSize } = useContext(ListContext);
  const size = sizeProp || parentSize;
  const { withClassPrefix, merge } = useClassNames(classPrefix);
  const listItemRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (listItemRef.current) {
      const { unregister } = register({
        node: listItemRef.current,
        edgeOffset: null,
        info: { collection, disabled, index }
      });
      return unregister;
    }
  }, [collection, disabled, index, register]);

  const classes = merge(className, withClassPrefix(size, { disabled, bordered }));

  return (
    <Component
      role="listitem"
      aria-disabled={disabled}
      {...rest}
      ref={mergeRefs(listItemRef as any, ref)}
      className={classes}
    >
      {children}
    </Component>
  );
});

ListItem.displayName = 'ListItem';

export default ListItem;
