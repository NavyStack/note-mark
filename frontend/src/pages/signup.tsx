import { Component, Show, createSignal } from 'solid-js';
import { createStore } from "solid-js/store";
import { useApi } from '../contexts/ApiProvider';
import { A, useNavigate } from '@solidjs/router';
import { ToastType, apiErrorIntoToast, useToast } from '../contexts/ToastProvider';
import { ApiError, HttpErrors } from '../core/api';
import WithApiSelect from '../components/with_api_select';
import Icon from '../components/icon';

const Signup: Component = () => {
  const { api, apiDetails } = useApi()
  const { pushToast } = useToast()
  const navigate = useNavigate()
  const [formDetails, setFormDetails] = createStore({
    username: "",
    password: "",
    passwordConfirm: "",
    name: "",
  })
  const [loading, setLoading] = createSignal(false)

  const onSubmit = async (ev: Event) => {
    ev.preventDefault()
    setLoading(true)
    let result = await api().createUser({
      username: formDetails.username,
      password: formDetails.password,
      name: formDetails.name || undefined,
    })
    setLoading(false)
    if (result instanceof ApiError) {
      if (result.status === HttpErrors.Forbidden) {
        pushToast({ message: "server is not accepting new accounts", type: ToastType.ERROR })
      } else {
        pushToast(apiErrorIntoToast(result, "creating account"))
      }
    } else {
      pushToast({ message: "created new account", type: ToastType.SUCCESS })
      navigate("/login")
    }
  }

  const passwordsMatch = () => formDetails.password === formDetails.passwordConfirm

  return (
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content w-full flex-col">
        <div class="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
          <div class="card-body">
            <img class="mb-2 mx-auto w-36" src="/icon.svg" alt="Note Mark Icon" />
            <div class="text-center">
              <h1 class="text-5xl font-bold">Note Mark</h1>
              <p class="py-6">Create your account here.</p>
            </div>
            <form onSubmit={onSubmit}>
              <WithApiSelect>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Username</span>
                  </label>
                  <input
                    class="input input-bordered"
                    value={formDetails.username}
                    oninput={(ev) => { setFormDetails({ username: ev.currentTarget.value }) }}
                    type="text"
                    placeholder="e.g. leo"
                    autocomplete="username"
                    pattern="[A-Za-z0-9]+"
                    minlength={3}
                    maxlength={30}
                    required
                  />
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Full Name</span>
                  </label>
                  <input
                    class="input input-bordered"
                    value={formDetails.name}
                    oninput={(ev) => { setFormDetails({ name: ev.currentTarget.value }) }}
                    type="text"
                    placeholder="e.g. Leo S"
                    maxlength={128}
                  />
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Password</span>
                  </label>
                  <input
                    class="input input-bordered"
                    value={formDetails.password}
                    oninput={(ev) => { setFormDetails({ password: ev.currentTarget.value }) }}
                    type="password"
                    placeholder="e.g. P@ssword123"
                    autocomplete="new-password"
                    required
                  />
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Password Confirm</span>
                  </label>
                  <input
                    class="input input-bordered"
                    classList={{ "input-error": !passwordsMatch() }}
                    value={formDetails.passwordConfirm}
                    oninput={(ev) => { setFormDetails({ passwordConfirm: ev.currentTarget.value }) }}
                    type="password"
                    placeholder="e.g. P@ssword123"
                    autocomplete="new-password"
                    required
                  />
                </div>
                <Show when={!apiDetails().info}>
                  <div class="alert my-4">
                    <Icon name="info" />
                    <span>No valid server set!</span>
                  </div>
                </Show>
                <div class="join join-vertical w-full mt-5">
                  <button class="btn join-item btn-primary" disabled={!passwordsMatch() || loading() || !apiDetails().info} type="submit">
                    {loading() && <span class="loading loading-spinner"></span>}
                    Create User
                  </button>
                  <A class="btn join-item" href="/login">Have An Account?</A>
                  <A class="btn join-item" href="/" classList={{ "btn-disabled": !apiDetails().info }}>Back Home</A>
                </div>
              </WithApiSelect>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
