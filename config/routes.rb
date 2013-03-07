Hlfwy::Application.routes.draw do
  resources :home, :only => [:index] do
    collection do
      get :geocode
      get :search_yelp
    end
  end
  root :to => 'home#index'
end
