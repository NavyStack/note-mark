import { Component, Show } from 'solid-js';
import { Breadcrumb } from '../../core/types';
import { HiOutlineDocument, HiOutlineFolder, HiOutlineUser } from 'solid-icons/hi';

type NoteBreadcrumbProps = Breadcrumb

const NoteBreadcrumb: Component<NoteBreadcrumbProps> = (props) => {
  return (
    <div class="p-2 text-sm breadcrumbs rounded-md shadow-md bg-base-200">
      <ul>
        <Show when={props.username}>
          <li>
            <HiOutlineUser size={16} />
            <span class="ml-1">{props.username}</span>
          </li>
          <Show when={props.bookSlug}>
            <li>
              <HiOutlineFolder size={16} />
              <span class="ml-1">{props.bookSlug}</span>
            </li>
            <Show when={props.noteSlug}>
              <li>
                <HiOutlineDocument size={16} />
                <span class="ml-1">{props.noteSlug}</span>
              </li>
            </Show>
          </Show>
        </Show>
      </ul>
    </div>
  )
}

export default NoteBreadcrumb;
