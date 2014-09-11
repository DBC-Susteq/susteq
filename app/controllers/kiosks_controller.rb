class KiosksController < ApplicationController
  include PerspectiveSummary
  layout "provider_application"
  before_filter :require_employee_signin

  def index
    @kiosks = current_provider.kiosks
    sum = 0
    @kiosks.each do |k|
      sum += k.credits_sold
    end
    @total_credits_sold = sum
    hubs = getHubs
    @viz_data = [hubs].to_json
  end

  def show
    @kiosk = Kiosk.find(params[:id])
  end
end
