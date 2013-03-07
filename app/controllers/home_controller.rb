class HomeController < ApplicationController
  def index
  end
  def geocode
    addresses = []
    params[:addresses].each do |address|
      addresses << address
    end
    addresses.map! { |address| Geocoder.search(address).first }

    addresses_coordinates = []
    addresses.each do |address|
      addresses_coordinates << [address.latitude, address.longitude]
    end
    geographic_center = Geocoder::Calculations.geographic_center(addresses_coordinates)
    render :json => geographic_center
  end
  def search_yelp
    consumer_key = '6urZDJ1aZ5o6fMJsNSHkRg'
    consumer_secret = 'imoHLajHsoKMq0nDrh_eAc2SPfM'
    token = '8GmJMTEqbUoCelilkCDKcj4pNbXObdaZ'
    token_secret = 'bUYj_Wcpa3pxWQglcTU0K31RyHY'

    api_host = 'api.yelp.com'

    consumer = OAuth::Consumer.new(consumer_key, consumer_secret, {:site => "http://#{api_host}"})
    access_token = OAuth::AccessToken.new(consumer, token, token_secret)

    search = (params[:search][:search]).split.join('+')
    location = (params[:search][:location]).join(',')

    path = "/v2/search?term=#{search}&limit=5&sort=1&ll=#{location}"

    result = access_token.get(path).body
    render :json => result
  end
end

